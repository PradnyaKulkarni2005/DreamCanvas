'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle } from 'react-icons/fa'; // user icon

type ProfileMenuProps = {
  // prop showing the login state passed from the parent
  isLoggedIn: boolean;
  // logout function from the parent
  onLogout: () => void;
};

export default function ProfileMenu({ isLoggedIn, onLogout }: ProfileMenuProps) {
  // state to check if the dropdown is opened or not
  const [isOpen, setIsOpen] = useState(false);
  // reference to the dropdown element
  // useref used to detect clicks  outside the dropdown
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // check if the click was outside the dropdown
      // target as the event target
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // close the dropdown
        setIsOpen(false);
      }
    }
    // add event listener to the document when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    // remove event listener when the component unmounts
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    // if the user is logged in, show the dropdown
    <div className="absolute top-4 right-6 z-50 text-white" ref={menuRef}>
      {/* after clicking dropdown , it will be opened and the dropdown will be shown */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-white font-semibold hover:bg-emerald-600 transition duration-300 shadow-md"
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
            className="mt-2 w-56 bg-gray-900 text-white rounded-xl shadow-2xl absolute right-0 z-50 py-2"
          >
            {isLoggedIn ? (
              <>
                <Link
                  href="/calender"
                  className="block px-4 py-2 hover:bg-emerald-700 transition"
                >
                  🚀 Continue Your Journey
                </Link>
                <Link
                  href="/progress"
                  className="block px-4 py-2 hover:bg-emerald-700 transition"
                >
                  📊 View Your Progress
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-600 text-red-400 transition"
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
    </div>
  );
}
