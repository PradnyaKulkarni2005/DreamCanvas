'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/app/libs/supabaseClient';
import { FaFire, FaStar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
// takes props userid
export default function BadgeWall({
  userId,
  onClose,
}: {
  userId: string;
  onClose?: () => void;
}) {
  // state for badges ,points and streak
  const [badges, setBadges] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

// fetch badges from supabase
  useEffect(() => {
    const fetchBadges = async () => {
      // fetch badges from supabase
      const { data } = await supabase
        .from('badges')
        .select('badge_name')
        .eq('user_id', userId);
// set badges state
      if (data) setBadges(data.map((b) => b.badge_name));
    };
// fetch points from supabase
    const fetchUserStats = async () => {
      const { data } = await supabase
        .from('users')
        .select('points, streak')
        .eq('id', userId)
        .single();
// set points and streak state  
      if (data) {
        setPoints(data.points || 0);
        setStreak(data.streak || 0);
      }
    };
// fetch badges and user stats
    if (userId) {
      fetchBadges();
      fetchUserStats();
    }
  }, [userId]);

  const getBadgeImage = (badgeName: string) => {
    // return badge image based on badge name
    if (badgeName === 'Day 1 Start') return '/badges/day1_start.png';
    
    if (badgeName === 'Ultimate Finisher') return '/badges/ultimate_finisher.png';
    
// return badges for streak
    const streakMatch = badgeName.match(/^(\d+)-Day Streak$/);
    // return badge image based on streak
    if (streakMatch) {
      const day = streakMatch[1];
      return `/badges/streak_${day}.png`;
    }

    return '/badges/default.png';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="relative bg-neutral-900 text-white rounded-2xl p-6 w-full max-w-5xl shadow-2xl"
        >
          {onClose && (
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, color: '#f87171' }} // red-400
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 right-4 text-white transition-all"
              aria-label="Close badge wall"
            >
              <IoClose size={28} />
            </motion.button>
          )}

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-emerald-400">
              🏅 Your Achievements
            </h2>
            <div className="flex justify-center gap-8 text-lg font-medium mt-2">
              <div className="flex items-center gap-2 text-yellow-300">
                <FaStar /> <span>{points} XP</span>
              </div>
              <div className="flex items-center gap-2 text-orange-400">
                <FaFire /> <span>{streak} Day Streak</span>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4 text-center text-white">
            🎖️ Badges Earned
          </h3>

          {badges.length === 0 ? (
            <p className="text-center text-gray-400">
              No badges yet. Keep progressing!
            </p>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center"
            >
              {badges.map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-center"
                >
                  <img
                    src={getBadgeImage(badge)}
                    alt={badge}
                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain"
                  />
                  <p className="text-sm mt-2 text-white">{badge}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
