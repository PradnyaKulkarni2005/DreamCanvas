// app/about/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const badges = [
  { name: 'Starter Day Badge', src: '/badges/day1_start.png' },
  { name: '3-Day Streak', src: '/badges/streak_3.png' },
  { name: '7-Day Streak', src: '/badges/streak_7.png' },
  { name: '14-Day Streak', src: '/badges/streak_14.png' },
  { name: 'Ultimate Finisher', src: '/badges/ultimate_finisher.png' },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto p-8 text-white animate-fade-in">
      <motion.h1
        className="text-4xl font-bold mb-6 text-emerald-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🚀 Welcome to DreamCanvas!
      </motion.h1>

      <motion.p
        className="text-lg text-gray-300 mb-6 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        DreamCanvas is your personal career guide that crafts a <span className="text-white font-semibold">30-day learning roadmap</span> based on the skills you already have and the role you&rsquo;re aiming for. Whether you&rsquo;re switching careers or upskilling — we've got your journey mapped.
      </motion.p>

      <motion.div
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-emerald-300 mb-2">📅 Daily Learning Journey</h2>
        <p className="text-gray-400">
          Each day, you&rsquo;ll unlock focused topics and subtasks designed to level up your skills. After completing a day&rsquo;s tasks, you earn <span className="text-white font-semibold">+50 XP</span> and unlock milestone badges along the way!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-emerald-300 mb-4">🎖️ Badge Rewards</h2>
        <p className="text-gray-400 mb-4">
          Stay consistent and earn badges for your streaks and accomplishments:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.name}
              className="flex flex-col items-center bg-[#161b22] p-4 rounded-xl shadow-md hover:shadow-emerald-400/30 transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Image
                src={badge.src}
                alt={badge.name}
                width={80}
                height={80}
                className="rounded-full mb-2"
              />
              <span className="text-sm text-gray-300 text-center">{badge.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          href="/"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg transition"
        >
          Start Your DreamCanvas Journey →
        </Link>
      </motion.div>
    </div>
  );
}
