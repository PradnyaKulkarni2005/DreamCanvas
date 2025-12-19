'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/_libs/supabaseClient';
import VantaDotsBackground from '@/app/components/VantaDotsBackground';
import ProfileMenu from '@/app/components/ProfileMenu';
import BadgeWall from '@/app/components/BadgeWall';
import JobChecker from '@/app/JobDetection/page';
import { motion } from 'framer-motion';

export default function Page() {
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showBadgeWall, setShowBadgeWall] = useState(false);
  const [showJobChecker, setShowJobChecker] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkSession = async () => {
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
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <VantaDotsBackground />

      {/* Top-right profile menu */}
      <div className="absolute top-6 right-6 z-30">
        <ProfileMenu isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center z-10 relative px-4 py-20">
        <motion.div
          className="max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main heading with enhanced styling */}
          <motion.h1
            className="font-montserrat text-7xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-white via-emerald-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            DreamCanvas
          </motion.h1>

          {/* Subtitle with better spacing */}
          <motion.p
            className="font-roboto text-slate-300 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Turn Ambitions into Action — Let's Build Your Path.
          </motion.p>

          {/* CTA Buttons Container */}
          {!showBadgeWall && (
            <motion.div
              className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Primary CTA Button - Get Started */}
              <button
                onClick={async () => {
                  if (!userId) {
                    router.push('/login');
                    return;
                  }
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
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 px-8 py-4 font-semibold text-white shadow-2xl shadow-emerald-500/50 transition-all duration-300 hover:shadow-emerald-400/60 hover:scale-105 active:scale-95 min-w-[200px]"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center gap-3 text-lg">
                  <span className="transition-all duration-300 group-hover:translate-x-1">
                    Get Started
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 transition-all duration-300 group-hover:translate-x-2"
                  >
                    <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
                  </svg>
                </span>
              </button>

              {/* Secondary CTA Button - Job Checker */}
              <button
                onClick={() => setShowJobChecker((prev) => !prev)}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-slate-800/80 backdrop-blur-sm px-8 py-4 font-semibold text-white shadow-xl shadow-slate-900/50 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 border border-slate-600/50 hover:border-cyan-400/50 min-w-[200px]"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center gap-3 text-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 transition-all duration-300 group-hover:rotate-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="transition-all duration-300 group-hover:text-cyan-300">
                    {showJobChecker ? "Hide Job Checker" : "Check Job Post"}
                  </span>
                </span>
              </button>
            </motion.div>
          )}

          {/* Badge Wall Toggle - Subtle and elegant */}
          {isLoggedIn && userId && (
            <motion.button
              onClick={() => setShowBadgeWall((prev) => !prev)}
              className="mt-12 text-emerald-400/80 text-sm font-medium hover:text-emerald-300 transition-all duration-300 flex items-center gap-2 mx-auto group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="h-px w-8 bg-emerald-400/50 group-hover:w-12 transition-all duration-300" />
              {/* <span className="uppercase tracking-wider">
                {showBadgeWall ? 'Hide My Badges' : 'View My Badges'}
              </span> */}
              <span className="h-px w-8 bg-emerald-400/50 group-hover:w-12 transition-all duration-300" />
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Badge Wall overlay - Enhanced backdrop */}
      {showBadgeWall && isLoggedIn && userId && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-40 p-4 bg-black/70 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowBadgeWall(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-6xl w-full bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-emerald-500/30 overflow-auto max-h-[90vh] relative"
          >
            {/* Close button */}
            <button
              onClick={() => setShowBadgeWall(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <BadgeWall userId={userId} />
          </motion.div>
        </motion.div>
      )}

      {/* Job Checker overlay - Enhanced backdrop */}
      {showJobChecker && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-40 p-4 bg-black/70 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowJobChecker(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-cyan-500/30 overflow-auto max-h-[90vh] relative"
          >
            {/* Close button */}
            <button
              onClick={() => setShowJobChecker(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <JobChecker />
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}