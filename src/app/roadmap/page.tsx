'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DownloadPDFButton from '@/app/components/DownloadPDFButton';

// Interface - like a blueprint for an object
// This interface defines the structure of each roadmap item
interface DayPlan {
  day: number;
  topic: string;
  subtasks: string[];
}

// Interface for YouTube video result
interface VideoResult {
  title: string;
  videoId: string;
  thumbnail: string;
  channel: string;
}

// This component displays the user's personalized roadmap
// It retrieves the roadmap data from localStorage and displays it
export default function RoadmapPage() {
  // useState is a React hook that allows you to add state to functional components
  // It returns an array with the current state and a function to update it
  const [roadmap, setRoadmap] = useState<DayPlan[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const [videoMap, setVideoMap] = useState<Record<string, VideoResult[]>>({});
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient();
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // If not logged in, redirect to login page
        router.push('/login');
      } else {
        // Load roadmap and skills from localStorage if user is authenticated
        const stored = localStorage.getItem('roadmap');
        const skills = localStorage.getItem('missingSkills');
        const target = localStorage.getItem('targetRole');

        if (stored) setRoadmap(JSON.parse(stored));
        if (skills) setMissingSkills(JSON.parse(skills));
        if (target) setRole(target);

        setLoading(false); // Done loading
      }
    };

    checkAuth();
  }, [supabase, router]);

  // --- COMMENTED OUT VIDEO FETCHING FOR NOW ---
  // You can re-enable this block later when videos are needed
  /*
  useEffect(() => {
    const fetchYouTubeVideos = async (query: string): Promise<VideoResult[]> => {
      try {
        const res = await fetch('/api/search-youtube', {
          method: 'POST',
          body: JSON.stringify({ query }),
        });
        return await res.json();
      } catch (error) {
        console.error('YouTube API error:', error);
        return [];
      }
    };

    const fetchAllVideos = async () => {
      const map: Record<string, VideoResult[]> = {};

      for (const item of roadmap) {
        for (const subtask of item.subtasks) {
          if (!map[subtask]) {
            const videos = await fetchYouTubeVideos(subtask);
            map[subtask] = videos.slice(0, 2); // Limit to 2 videos per subtask
          }
        }
      }

      setVideoMap(map);
    };

    if (roadmap.length > 0) fetchAllVideos();
  }, [roadmap]);
  */

  // Display loading while auth/roadmap loads
  if (loading) return <div className="text-white p-6">Loading your roadmap...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white animate-fade-in" >
      <h1 className="text-3xl font-bold mb-4 text-emerald-400 animate-fade-in-up">
        Your Roadmap to Become a {role}
      </h1>

      <p className="mb-6 text-lg text-gray-300 animate-fade-in-up delay-100">
        <strong className="text-white">Skills to Learn:</strong>{' '}
        {missingSkills.length > 0 ? missingSkills.join(', ') : 'None'}
      </p>
    <DownloadPDFButton targetId="roadmap-to-print" />
      <div id='roadmap-to-print' className="bg-[#0d1117] text-white p-6 space-y-6">
        {/* Mapping through the roadmap array and display each item */}
        {roadmap.map((item, index) => (
          <div
            key={item.day}
            className="bg-[#161b22] border border-emerald-700/40 shadow-lg rounded-xl p-6 hover:shadow-emerald-500/30 transition duration-300 transform hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
          >
            <p className="text-xl font-semibold text-emerald-400 mb-2">
              Day {item.day}: <span className="text-white">{item.topic}</span>
            </p>

            {/* Listing each subtask with YouTube videos */}
            <ul className="list-disc list-inside pl-2 space-y-4 text-gray-300 text-sm">
              {item.subtasks.map((task, idx) => (
                <li key={idx} className="hover:text-white transition">
                  {task}

                  {/* Video suggestions temporarily disabled */}
                  {/* Enable this block later when ready */}
                  {/* 
                  <div className="mt-2 ml-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {videoMap[task]?.map((video) => (
                      <a
                        key={video.videoId}
                        href={`https://youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start space-x-2 border border-gray-700 rounded-lg p-2 hover:border-emerald-500 transition"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-20 h-14 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-white leading-tight">{video.title}</p>
                          <p className="text-xs text-gray-400">{video.channel}</p>
                        </div>
                      </a>
                    )) || (
                      <p className="text-gray-500 text-xs">Loading videos...</p>
                    )}
                  </div> 
                  */}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
