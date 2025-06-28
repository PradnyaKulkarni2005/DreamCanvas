'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/libs/supabaseClient';
import VantaDotsBackground from '@/app/components/VantaDotsBackground';
import ProfileMenu from '@/app/components/ProfileMenu';
import BadgeWall from '@/app/components/BadgeWall';
import { motion } from 'framer-motion';

export default function Page() {
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showBadgeWall, setShowBadgeWall] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkSession = async () => {
      // getting user session from supabase 
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setIsLoggedIn(true);
        setUserId(data.session.user.id);
      }
    };
    checkSession();
  }, []);
// handles logout
  const handleLogout = async () => {
    // removing user session from supabase
    await supabase.auth.signOut();
    // resetting state
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    // redirecting to login page
    router.push('/login');
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <VantaDotsBackground />

      {/* Top-right profile menu */}
      <div className="top-4 right-6 z-10">
        <ProfileMenu isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center h-screen text-center z-10 relative px-4">
        <motion.h1
          className="text-5xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          DreamCanvas
        </motion.h1>

        <motion.p
          className="mb-6 text-white text-lg max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Turn Ambitions into Action — Let’s Build Your Path.
        </motion.p>

        {/* Hide button if badge wall is shown */}
        {!showBadgeWall && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <button
  onClick={async () => {
    // if a user is not logged in redirect to login
    if (!userId) {
      router.push('/login');
      return;
    }
// if logged in check if it has roadmap
//if roadmap then -> calender
//else -> analyze
    const { data, error } = await supabase
      .from('roadmap')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking roadmap:', error.message);
      router.push('/analyze');
      return;
    }

    if (data) {
      router.push('/calender');
    } else {
      router.push('/analyze');
    }
  }}
  className="group relative inline-block font-semibold leading-6 text-white shadow-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-emerald-600 rounded-2xl bg-neutral-900 p-px shadow-emerald-900"
>
  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
  <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-950">
    <div className="relative z-10 flex items-center space-x-3">
      <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300">
        Get Started
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300"
      >
        <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
      </svg>
    </div>
  </span>
</button>

          </motion.div>
        )}

        {/* Toggle Badge Wall */}
        {isLoggedIn && userId && (
          <motion.button
            onClick={() => setShowBadgeWall((prev) => !prev)}
            className="mt-8 text-emerald-400 underline hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* {showBadgeWall ? 'Hide My Badges' : 'View My Badges'} */}
          </motion.button>
        )}
      </div>

      {/* Badge Wall overlay */}
      {showBadgeWall && isLoggedIn && userId && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl w-full bg-black/70 backdrop-blur-md rounded-2xl p-6 shadow-lg overflow-auto max-h-[90vh]"
          >
            <BadgeWall userId={userId} />
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
