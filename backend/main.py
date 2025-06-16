from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
from pathlib import Path
from transformers import AutoProcessor, AutoModelForVision2Seq
from PIL import Image
import torch
from TTS.api import TTS
import uuid
import io

app = FastAPI(title="StoryLens API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories for storing files
UPLOAD_DIR = Path("uploads")
AUDIO_DIR = Path("audio")
UPLOAD_DIR.mkdir(exist_ok=True)
AUDIO_DIR.mkdir(exist_ok=True)

# Initialize models
print("Loading Kosmos-2 model...")
processor = AutoProcessor.from_pretrained("microsoft/kosmos-2")
model = AutoModelForVision2Seq.from_pretrained("microsoft/kosmos-2")

print("Loading TTS model...")
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")

@app.post("/api/generate-story")
async def generate_story(file: UploadFile = File(...)):
    try:
        # Save uploaded image
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        
        # Generate unique filename
        image_path = UPLOAD_DIR / f"{uuid.uuid4()}.jpg"
        image.save(image_path)

        # Process image with Kosmos-2
        inputs = processor(images=image, text="Generate a creative story about this image:", return_tensors="pt")
        generated_ids = model.generate(
            pixel_values=inputs["pixel_values"],
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_length=256,
            num_beams=5,
        )
        generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        
        # Generate audio from text
        audio_path = AUDIO_DIR / f"{uuid.uuid4()}.wav"
        tts.tts_to_file(
            text=generated_text,
            file_path=str(audio_path),
            speaker_wav="path_to_reference_audio.wav",
            language="en"
        )

        return {
            "story": generated_text,
            "audio_path": str(audio_path),
            "image_path": str(image_path)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/audio/{filename}")
async def get_audio(filename: str):
    audio_path = AUDIO_DIR / filename
    if not audio_path.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(audio_path)

@app.get("/api/image/{filename}")
async def get_image(filename: str):
    image_path = UPLOAD_DIR / filename
    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image file not found")
    return FileResponse(image_path) 