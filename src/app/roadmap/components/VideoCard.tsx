import React from "react";
import Image from "next/image";
import { VideoResult } from "@/_types";

export default function VideoCard({ video }: { video: VideoResult }) {
  return (
    <a
      href={`https://youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      title={video.title}
      className="block"
    >
      <div className="rounded-xl shadow-md p-2 bg-[#1e1e1e] hover:scale-105 transition duration-200">
        <div className="relative w-full h-48 rounded overflow-hidden">
          <Image
            src={video.thumbnail}
            alt={video.title || "YouTube Video Thumbnail"}
            fill                          // ✅ replaces layout="fill"
            style={{ objectFit: "cover" }} // ✅ replaces objectFit="cover"
            loading="lazy"
            unoptimized                   // ✅ required for external thumbnails
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
