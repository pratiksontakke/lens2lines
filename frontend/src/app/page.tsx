'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FileUploader } from '@/components/FileUploader';
import { StoryDisplay } from '@/components/StoryDisplay';

export default function Home() {
  const [story, setStory] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/generate-story', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      setStory(data.story);
      setAudioUrl(`http://localhost:8000/api/audio/${data.audio_path.split('/').pop()}`);
      setImageUrl(`http://localhost:8000/api/image/${data.image_path.split('/').pop()}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
          StoryLens
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Transform your photos into captivating stories with AI
        </p>

        <div className="max-w-3xl mx-auto">
          <FileUploader onUpload={handleFileUpload} isLoading={isLoading} />

          {isLoading && (
            <div className="text-center mt-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Generating your story...</p>
            </div>
          )}

          {story && !isLoading && (
            <StoryDisplay
              story={story}
              audioUrl={audioUrl}
              imageUrl={imageUrl}
            />
          )}
        </div>
      </div>
    </main>
  );
} 