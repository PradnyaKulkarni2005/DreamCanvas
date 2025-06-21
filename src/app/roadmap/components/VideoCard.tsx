import React from 'react';
// imported videoresult from types
import { VideoResult } from '@/types';

// VideoCard component takes a video prop of type VideoResult
export default function VideoCard({ video }: { video: VideoResult }) {
  return (
    // link to YouTube video with videoId
    <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank">
       {/* displays video details */}
      <div className="rounded-xl shadow-md p-2 hover:scale-105 transition">

        <img src={video.thumbnail} alt={video.title} className="rounded" />
        <p className="text-sm font-medium mt-1">{video.title}</p>
        <p className="text-xs text-gray-500">{video.channel}</p>
      </div>
    </a>
  );
}
