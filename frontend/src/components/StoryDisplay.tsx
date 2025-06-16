'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface StoryDisplayProps {
  story: string;
  audioUrl: string;
  imageUrl: string;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({
  story,
  audioUrl,
  imageUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="mt-12 space-y-8">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt="Uploaded photo"
          fill
          className="object-cover"
        />
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Your Story</h2>
        <p className="text-gray-700 leading-relaxed mb-6">{story}</p>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={togglePlay}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span className="text-xl">
              {isPlaying ? '⏸' : '▶️'}
            </span>
            <span>{isPlaying ? 'Pause' : 'Listen'}</span>
          </button>
        </div>

        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      </div>
    </div>
  );
}; 