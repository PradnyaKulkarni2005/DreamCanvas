'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/libs/supabaseClient';
import { RoadmapItem, VideoResult } from '@/types';
import Loader from '@/app/components/Loader';
import DaySection from '@/app/roadmap/components/DaySection';

export default function CalendarPage() {
  // usestates for storing roadmap data, videos, selected day, and target role
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [videoMap, setVideoMap] = useState<Record<string, VideoResult[]>>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [target, setTarget] = useState('');


  // ✅ Fetch roadmap from Supabase
  useEffect(() => {
    const fetchRoadmap = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    router.replace('/login');
    return;
  }

  const userId = session.user.id;
  console.log('🔍 Fetching roadmap for user:', userId);

  // ✅ Fetch the target role from users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('target')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error('❌ Failed to fetch target role:', userError.message);
  } else if (userData?.target) {
    setTarget(userData.target); // 🔑 Save to state
  }

  // ✅ Fetch the roadmap itself
  // This retrieves all roadmap items for the current user
  const { data, error } = await supabase
    .from('roadmap')
    .select('*')
    .eq('user_id', userId);

  if (error || !Array.isArray(data)) {
    console.error('❌ Failed to load roadmap', error);
    router.replace('/analyze');
    return;
  }
// ✅ Sort roadmap items by day
// [...data].sort((a, b) => Number(a.day) - Number(b.day)) - means we create a new array from data and sort it by day
  const sorted = [...data].sort((a, b) => Number(a.day) - Number(b.day));
  setRoadmap(sorted);
  setLoading(false);
};


    fetchRoadmap();
  }, [router]);

  // ✅ Fetch video suggestions once roadmap is ready
  useEffect(() => {
    if (!roadmap.length) return;

    const fetchVideos = async () => {
     
      const uniqueTopics = new Set<string>();

      // ✅ Safely extract topics or fallback to single topic
      // This ensures we handle both arrays and single topics

      roadmap.forEach((item) => {
        if (Array.isArray(item.topics)) {
          item.topics.forEach((topic) => uniqueTopics.add(topic));
        } else if (item.topic) {
          uniqueTopics.add(item.topic);
        }
      });
// newVideoMap is a record that will hold the video results for each topic
      // ✅ Initialize videoMap with empty arrays for each unique topic
      const newVideoMap: Record<string, VideoResult[]> = {};
// This will hold the video results for each topic
// promise.all is used to fetch videos for each unique topic concurrently for entire roadmap topics
      await Promise.all(
        // ✅ Map over unique topics and fetch videos
        // This will fetch videos for each unique topic
        Array.from(uniqueTopics).map(async (topic) => {
          try {
            const res = await fetch('/api/search-youtoube', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: `${topic} for ${target}` }),

            });

            if (!res.ok) throw new Error(`YouTube API failed: ${res.statusText}`);
            const data = await res.json();
            newVideoMap[topic] = data || [];
          } catch (err) {
            console.error(`❌ Failed to fetch videos for "${topic}"`, err);
            newVideoMap[topic] = [];
          }
        })
      );

      setVideoMap(newVideoMap);
    };

    fetchVideos();
  }, [roadmap,target]);

  // ✅ Show loading screen
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  const selectedItem = roadmap.find((item) => item.day === selectedDay);

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-emerald-400">
        Your 30-Day Roadmap
      </h1>

      {/* ✅ Calendar Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 mb-10">
        {Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`rounded-xl p-4 text-sm font-semibold border transition duration-200 ${
                selectedDay === day
                  ? 'bg-emerald-500 border-emerald-400'
                  : 'bg-[#161b22] border-gray-700 hover:bg-emerald-700'
              }`}
            >
              Day {day}
            </button>
          );
        })}
      </div>

      {/* ✅ Selected Day Content */}
      {/* loop through roadmap items and display them */}
      {selectedDay !== null && (
        <div className="animate-fade-in-up">
          {selectedItem ? (
            <DaySection
              item={{
                ...selectedItem,
                topics:
                  selectedItem.topics ??
                  (selectedItem.topic ? [selectedItem.topic] : []),
              }}
              videoMap={videoMap}
            />
          ) : (
            <p className="text-center text-gray-400">
              No roadmap content found for Day {selectedDay}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
