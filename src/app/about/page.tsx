'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Award, Zap, ArrowRight, Target, TrendingUp, Star } from 'lucide-react';

const badges = [
  { name: 'Starter Day Badge', src: '/badges/day1_start.png', description: 'Complete your first task' },
  { name: '3-Day Streak', src: '/badges/streak_3.png', description: '3 consecutive days' },
  { name: '7-Day Streak', src: '/badges/streak_7.png', description: '1 week streak' },
  { name: '14-Day Streak', src: '/badges/streak_14.png', description: '2 weeks streak' },
  { name: 'Ultimate Finisher', src: '/badges/ultimate_finisher.png', description: 'Complete all 30 days' },
];

const features = [
  {
    icon: Target,
    title: 'Personalized Roadmap',
    description: 'Custom 30-day learning path tailored to your skills and career goals',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Calendar,
    title: 'Daily Tasks',
    description: 'Focused topics and subtasks designed to level up your expertise',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Zap,
    title: 'Earn XP & Badges',
    description: 'Get +50 XP per completed day and unlock achievement badges',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed analytics and insights',
    color: 'from-orange-500 to-red-500'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Your Career Journey Starts Here</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent leading-tight">
            Welcome to DreamCanvas
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Your personal career guide that crafts a{' '}
            <span className="text-white font-bold bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 px-2 py-1 rounded">
              30-day learning roadmap
            </span>{' '}
            based on your skills and career aspirations. Switch careers or upskill — we've got you covered.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-800/50 hover:bg-slate-700/50 text-white font-semibold px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">
            Why Choose DreamCanvas?
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            A comprehensive platform designed to accelerate your career growth with structured learning
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="group"
              >
                <div className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Badge Rewards Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-4">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">Achievement System</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Earn Badges & Rewards
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Stay consistent and unlock exclusive badges for your streaks and accomplishments
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {badges.map((badge, idx) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <Image
                      src={badge.src}
                      alt={badge.name}
                      width={100}
                      height={100}
                      className="relative rounded-full mx-auto ring-4 ring-slate-700/50 group-hover:ring-emerald-500/50 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-white text-center mb-1">{badge.name}</h3>
                  <p className="text-xs text-slate-400 text-center">{badge.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-slate-700/50 mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                30
              </div>
              <p className="text-slate-400 font-medium">Days of Learning</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <p className="text-slate-400 font-medium">XP Per Day</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                5
              </div>
              <p className="text-slate-400 font-medium">Achievement Badges</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl p-12 border border-emerald-500/20"
        >
          <Star className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already on their path to success. Start your personalized 30-day journey today.
          </p>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold px-10 py-5 rounded-xl shadow-2xl shadow-emerald-500/30 transition-all duration-300 inline-flex items-center gap-3 text-lg"
            >
              <Sparkles className="w-6 h-6" />
              Get Started Now
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}