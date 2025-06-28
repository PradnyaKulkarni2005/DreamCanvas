'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaMapMarkedAlt, FaChartLine, FaRocket } from 'react-icons/fa';
import BadgeWall from '../components/BadgeWall';
import { supabase } from '@/app/libs/supabaseClient';

type ProfileMenuProps = {
  // prop showing the login state passed from the parent
  isLoggedIn: boolean;
  // logout function from the parent
  onLogout: () => void;
};

// ProfileMenu component takes props
export default function ProfileMenu({ isLoggedIn, onLogout }: ProfileMenuProps) {
  // state to check if the dropdown is opened or not
  const [isOpen, setIsOpen] = useState(false);
  // reference to the dropdown element
  const [showBadges, setShowBadges] = useState(false);
  // userstate for checking if the user is logged in
  const [userId, setUserId] = useState<string | null>(null);
  // useref used to detect clicks outside the dropdown
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // ✅ Add router hook

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // check if the click was outside the dropdown
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // close the dropdown
        setIsOpen(false);
        setShowBadges(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const getUserId = async () => {
      // get the user id from supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) setUserId(session.user.id);
    };
    getUserId();
  }, []);

  return (
    // if the user is logged in, show the dropdown
    <div className="absolute top-4 right-6 z-50 text-white" ref={menuRef}>
      <button
        onClick={() => {
          setIsOpen(prev => !prev);
          setShowBadges(false);
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-emerald-600 transition shadow-md"
      >
        <FaUserCircle size={20} />
        {/* if the user is logged in, show the dropdown else show the login component */}
        {isLoggedIn ? 'Profile' : 'Login'}
      </button>

      {/* dropdown div */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 w-64 bg-gray-900 text-white rounded-xl shadow-2xl absolute right-0 z-50 py-2"
          >
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false); // close the menu
                    setShowBadges(false);
                    router.push('/calender'); // ✅ redirect
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-emerald-700 transition"
                >
                  <FaRocket /> Continue Your Journey
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowBadges(false);
                    router.push('/roadmap');
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-emerald-700 transition"
                >
                  <FaMapMarkedAlt /> View Your Roadmap
                </button>

                <button
                  onClick={() => {
                    setShowBadges(prev => !prev);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-emerald-700 transition"
                >
                  <FaChartLine /> View Your Progress
                </button>

                <div className="h-px bg-gray-700 my-1"></div>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-600 text-red-400 transition"
                >
                  🔓 Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-2 hover:bg-emerald-700 transition"
              >
                🔑 Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* BadgeWall shown conditionally */}
      {showBadges && userId && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-2 w-[400px] max-w-full z-40"
        >
          <BadgeWall userId={userId} />
        </motion.div>
      )}
    </div>
  );
}
