# StoryLens - Multi-modal Photo Story Generator

StoryLens is an AI-powered application that transforms your photos into captivating stories and poems, complete with audio narration. Upload any photo and let our AI weave a creative narrative around your memories.

## Features

- 📸 Photo Upload: Share your memorable moments
- 📝 AI Story Generation: Get unique stories and poems based on your photos using microsoft/kosmos-2
- 🎧 Audio Narration: Listen to your stories narrated by AI using coqui/xtts-v2
- 🌐 Web Interface: User-friendly interface for easy interaction

## Tech Stack

- Frontend: Next.js with TypeScript
- Backend: FastAPI (Python)
- AI Models:
  - Image Understanding: microsoft/kosmos-2
  - Text-to-Speech: coqui/xtts-v2
- Styling: Tailwind CSS
- Storage: Local file system

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/storylens.git
   cd storylens
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Create necessary environment variables:
   - Create `.env` in backend directory
   - Create `.env.local` in frontend directory

5. Start the development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   uvicorn main:app --reload

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. Open http://localhost:3000 in your browser

## Project Structure

```
storylens/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   └── services/
│   ├── requirements.txt
│   └── main.py
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── public/
│   └── styles/
└── README.md
```

## License

MIT

## Acknowledgments

- microsoft/kosmos-2 for image understanding and story generation
- coqui/xtts-v2 for text-to-speech generation
