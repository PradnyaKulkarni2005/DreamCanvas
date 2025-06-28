'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/libs/supabaseClient';
import { RoadmapItem, VideoResult } from '@/types';
import Loader from '@/app/components/Loader';
import DaySection from '@/app/roadmap/components/DaySection';
import ProgressBar from '../components/ProgressBar';
import { motion } from 'framer-motion';

export default function CalendarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [videoMap, setVideoMap] = useState<Record<string, VideoResult[]>>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [target, setTarget] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [videoLoading, setVideoLoading] = useState(false);

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
      setUserId(userId);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('target')
        .eq('id', userId)
        .single();

      if (!userError && userData?.target) {
        setTarget(userData.target);
      }

      const { data, error } = await supabase
        .from('roadmap')
        .select('*')
        .eq('user_id', userId);

      if (error || !Array.isArray(data)) {
        router.replace('/analyze');
        return;
      }

      const sorted = [...data].sort((a, b) => Number(a.day) - Number(b.day));
      setRoadmap(sorted);
      setLoading(false);
    };

    fetchRoadmap();
  }, [router]);

  const fetchVideosForDay = async (day: number) => {
    const item = roadmap.find((i) => i.day === day);
    if (!item) return;

    const topics = Array.isArray(item.topics)
      ? item.topics
      : item.topic
      ? [item.topic]
      : [];

    const newVideoMap = { ...videoMap };
    let needFetch = false;

    for (const topic of topics) {
      if (!newVideoMap[topic]) {
        needFetch = true;
        break;
      }
    }

    if (!needFetch) return;

    setVideoLoading(true);

    await Promise.all(
      topics.map(async (topic) => {
        if (newVideoMap[topic]) return;

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
    setVideoLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f172a]">
        <Loader />
      </div>
    );
  }

  const selectedItem = roadmap.find((item) => item.day === selectedDay);

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent"
      >
        🚀 Your Personalized 30-Day Journey
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <ProgressBar userId={userId} />
      </motion.div>

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 my-10">
        {Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          return (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={day}
              onClick={async () => {
                setSelectedDay(day);
                await fetchVideosForDay(day);
              }}
              className={`rounded-xl p-4 text-sm font-semibold transition duration-200 shadow-md ${
                selectedDay === day
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                  : 'bg-[#1e293b] hover:bg-emerald-600 text-gray-300'
              }`}
            >
              Day {day}
            </motion.button>
          );
        })}
      </div>

      {selectedDay !== null && (
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg"
        >
          {videoLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader />
            </div>
          ) : selectedItem ? (
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
        </motion.div>
      )}
    </div>
  );
}
