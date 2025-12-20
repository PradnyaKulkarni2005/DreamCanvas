'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/_libs/supabaseClient';
import VideoCard from './VideoCard';
import Swal from 'sweetalert2';
import { RoadmapItem, VideoResult } from '@/_types';
import { motion, AnimatePresence } from 'framer-motion';

export default function DaySection({
  item,
  videoMap,
}: {
  item: RoadmapItem & { topics?: string[]; topic?: string; subtasks?: string[] };
  videoMap: Record<string, VideoResult[]>;
}) {
  const topics = Array.isArray(item.topics)
    ? item.topics
    : item.topic
    ? [item.topic]
    : [];

  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) return;
      const { data } = await supabase
        .from('progress')
        .select('task, completed')
        .eq('user_id', userId)
        .eq('day', `Day ${item.day}`);

      if (data) {
        const initial: Record<string, boolean> = {};
        data.forEach((entry) => {
          initial[entry.task] = entry.completed;
        });
        setCompleted(initial);
      }
    };

    fetchProgress();
  }, [userId, item.day]);

  const handleToggle = async (topic: string) => {
    if (!userId) return;

    const newValue = !completed[topic];
    setCompleted((prev) => ({ ...prev, [topic]: newValue }));

    await supabase.from('progress').upsert(
      {
        user_id: userId,
        day: `Day ${item.day}`,
        task: topic,
        completed: newValue,
      },
      { onConflict: 'user_id,day,task' }
    );

    if (!newValue || completed[topic]) return;

    const { data: userData } = await supabase
      .from('users')
      .select('streak, points')
      .eq('id', userId)
      .single();

    const newXP = (userData?.points || 0) + 50;
    const newStreak = (userData?.streak || 0) + 1;

    await supabase
      .from('users')
      .update({ points: newXP, streak: newStreak })
      .eq('id', userId);

    const { data: awardedBadges } = await supabase
      .from('badges')
      .select('badge_name')
      .eq('user_id', userId);

    const alreadyAwarded = (name: string) =>
      awardedBadges?.some((b) => b.badge_name === name);

    const { count: completedTotal } = await supabase
      .from('progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true);

    if (completedTotal === 1 && !alreadyAwarded('Day 1 Start')) {
      await supabase.from('badges').insert({
        user_id: userId,
        badge_name: 'Day 1 Start',
      });

      await Swal.fire({
        title: '🌟 First Step!',
        text: 'You earned the "Day 1 Start" badge! Great beginning!',
        imageUrl: '/badges/day1_start.png',
        imageHeight: 100,
        icon: 'info',
      });
    }

    const milestones = [3, 7, 14];
    if (milestones.includes(newStreak)) {
      const badgeName = `${newStreak}-Day Streak`;
      const badgeImage = `/badges/streak_${newStreak}.png`;

      if (!alreadyAwarded(badgeName)) {
        await supabase.from('badges').insert({
          user_id: userId,
          badge_name: badgeName,
        });

        await Swal.fire({
          title: `🔥 ${newStreak}-Day Streak!`,
          text: `You earned the "${badgeName}" badge! Keep it up!`,
          imageUrl: badgeImage,
          imageHeight: 100,
          icon: 'info',
        });
      }
    }

    if (completedTotal === 30 && !alreadyAwarded('Ultimate Finisher')) {
      await supabase.from('badges').insert({
        user_id: userId,
        badge_name: 'Ultimate Finisher',
      });

      await Swal.fire({
        title: '🏆 All Done!',
        text: 'You completed every task! Ultimate Finisher badge awarded!',
        imageUrl: '/badges/ultimate_finisher.png',
        imageHeight: 100,
        confirmButtonColor: '#FFD700',
      });
    }

    Swal.fire({
      title: '✅ Completed',
      text: `You earned 50 XP for completing "${topic}".`,
      icon: 'success',
    });
  };

  const completedCount = topics.filter((t) => completed[t]).length;
  const progressPercentage = (completedCount / topics.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Progress</h3>
          <span className="text-sm font-bold text-emerald-400">
            {completedCount} / {topics.length} Complete
          </span>
        </div>
        <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Topics List */}
      <div className="space-y-5">
        {topics.map((topic, index) => (
          <motion.div
            key={topic}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              group relative rounded-2xl p-6 border transition-all duration-300
              ${
                completed[topic]
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
              }
            `}
          >
            {/* Completion Indicator */}
            {completed[topic] && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}

            {/* Topic Header */}
            <div className="flex items-start gap-4 mb-4">
              {/* Custom Checkbox */}
              <button
                onClick={() => handleToggle(topic)}
                className={`
                  relative flex-shrink-0 w-7 h-7 rounded-lg border-2 transition-all duration-300
                  ${
                    completed[topic]
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-400'
                      : 'bg-slate-700/50 border-slate-600 hover:border-emerald-500/50 hover:bg-slate-700'
                  }
                `}
              >
                <AnimatePresence>
                  {completed[topic] && (
                    <motion.svg
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="w-full h-full text-white p-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </button>

              {/* Topic Title */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`
                    text-lg font-semibold transition-all duration-300
                    ${
                      completed[topic]
                        ? 'text-slate-400 line-through'
                        : 'text-white group-hover:text-emerald-400'
                    }
                  `}
                >
                  {topic}
                </h3>
              </div>
            </div>

            {/* Subtasks */}
            {item.subtasks && item.subtasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-5 pl-11"
              >
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Subtasks
                  </h4>
                  <ul className="space-y-2">
                    {item.subtasks.map((subtask, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2 text-sm text-slate-400"
                      >
                        <span className="text-emerald-400 mt-1 flex-shrink-0">•</span>
                        <span>{subtask}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Videos Section */}
            <div className="pl-11">
              <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                Recommended Videos
              </h4>
              
              {videoMap[topic]?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videoMap[topic].map((video, idx) => (
                    <motion.div
                      key={video.videoId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <VideoCard video={video} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12 bg-slate-900/30 rounded-xl border border-slate-700/30">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-10 h-10 mx-auto mb-3 border-3 border-emerald-500 border-t-transparent rounded-full"
                    />
                    <p className="text-slate-400 text-sm">Loading videos...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion Message */}
      <AnimatePresence>
        {completedCount === topics.length && topics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-5xl mb-3"
            >
              🎉
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">
              Day {item.day} Complete!
            </h3>
            <p className="text-emerald-300 text-sm">
              Amazing work! You've completed all topics for today.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}