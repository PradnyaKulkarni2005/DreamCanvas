import React from 'react';
import Image from 'next/image';
import { VideoResult } from '@/types';

export default function VideoCard({ video }: { video: VideoResult }) {
  return (
    // Ensure the video object has all required properties
    <a
      href={`https://youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      title={video.title}
    >
      {/* // Use a link to open the video in a new tab */}
      <div className="rounded-xl shadow-md p-2 bg-[#1e1e1e] hover:scale-105 transition duration-200">
        <div className="relative w-full h-48">
          <Image
            src={video.thumbnail}
            alt={video.title || 'YouTube Video Thumbnail'}
            className="rounded"
            layout="fill"
            objectFit="cover"
            loading="lazy"
          />
        </div>
        <p className="text-sm font-medium mt-2 text-white line-clamp-2">
          {video.title}
        </p>
        <p className="text-xs text-gray-400">{video.channel}</p>
      </div>
    </a>
  );
}
