'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/_libs/supabaseClient';
import { RoadmapItem, VideoResult } from '@/_types';
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
        <Loader />
      </div>
    );
  }

  const selectedItem = roadmap.find((item) => item.day === selectedDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
            Your 30-Day Journey
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Transform your goals into reality with a structured learning path
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10 sm:mb-14"
        >
          <ProgressBar userId={userId} />
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-10 sm:mb-14"
        >
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-800/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Select a Day
              </h2>
              {selectedDay && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-full"
                >
                  <span className="text-emerald-400 font-semibold text-sm">
                    Day {selectedDay} Selected
                  </span>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 sm:gap-3 lg:gap-4">
              {Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                const isSelected = selectedDay === day;
                const isCompleted = false; // You can add completion logic here
                
                return (
                  <motion.button
                    key={day}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                      setSelectedDay(day);
                      await fetchVideosForDay(day);
                    }}
                    className={`
                      group relative rounded-2xl p-3 sm:p-4 font-bold text-sm sm:text-base
                      transition-all duration-300 shadow-lg
                      ${
                        isSelected
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white scale-105 shadow-emerald-500/50'
                          : isCompleted
                          ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-emerald-400 hover:from-slate-600 hover:to-slate-700'
                          : 'bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 hover:from-emerald-600 hover:to-teal-600 hover:text-white'
                      }
                      border ${
                        isSelected
                          ? 'border-emerald-400/50'
                          : 'border-slate-700/50 hover:border-emerald-500/50'
                      }
                    `}
                  >
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <span className="relative z-10 block">
                      {day}
                    </span>
                    
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        {selectedDay !== null && (
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800/50 shadow-2xl">
              {/* Day Header */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800/50">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <span className="text-2xl font-black text-white">{selectedDay}</span>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Day {selectedDay}
                  </h3>
                  <p className="text-slate-400 text-sm sm:text-base">
                    Continue your learning journey
                  </p>
                </div>
              </div>

              {/* Content */}
              {videoLoading ? (
                <div className="flex flex-col justify-center items-center py-16">
                  <Loader />
                  <p className="text-slate-400 mt-6 text-sm sm:text-base">
                    Loading your personalized content...
                  </p>
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
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-base sm:text-lg">
                    No content available for Day {selectedDay}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}