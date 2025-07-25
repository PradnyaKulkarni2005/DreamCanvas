'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { supabase } from '@/app/_libs/supabaseClient'; // ✅ Make sure this is your initialized Supabase client

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Handle login using Supabase client directly (no fetch)
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // ✅ Sign in using Supabase client
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      console.error('Login error:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || 'Login failed',
        position: 'top',
      });
      return;
    }

    // ✅ Get logged-in user details
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Could not fetch user details.',
        position: 'top',
      });
      return;
    }

    // ✅ Check if roadmap exists for this user
    // ✅ Check if roadmap exists for this user
    const { data: roadmapData } = await supabase
      .from('roadmap')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle(); // ✅ returns null if not found, no throw


    setLoading(false);

    // ✅ Redirect based on roadmap existence
    if (roadmapData) {
      router.push('/calender'); // ✅ has roadmap
    } else {
      router.push('/analyze'); // ✅ no roadmap yet
    }
  } catch (err) {
    console.error('Unexpected login error:', err);
    setLoading(false);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong, please try again.',
      position: 'top',
    });
  }
};

  return (
    <form
      onSubmit={handleLogin}
      className="bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl overflow-hidden border-4 border-blue-400 dark:border-blue-800 max-w-md mx-auto mt-20"
    >
      <div className="px-8 py-10 md:px-10">
        <h2 className="text-4xl font-extrabold text-center text-zinc-800 dark:text-white">
          Welcome Back!
        </h2>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mt-3">
          Sign in to continue your Journey to Success.
        </p>
        <div className="mt-10">
          <div className="relative">
            <label
              className="block mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-200"
              htmlFor="email"
            >
              Email
            </label>
            <input
              placeholder="you@example.com"
              className="block w-full px-4 py-3 mt-2 text-zinc-800 bg-white border-2 rounded-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-opacity-50 focus:outline-none focus:ring focus:ring-blue-400"
              name="email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-6">
            <label
              className="block mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-200"
              htmlFor="password"
            >
              Password
            </label>
            <input
              placeholder="••••••••"
              className="block w-full px-4 py-3 mt-2 text-zinc-800 bg-white border-2 rounded-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-opacity-50 focus:outline-none focus:ring focus:ring-blue-400"
              name="password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-10">
            <button
              className="w-full px-4 py-3 tracking-wide text-white transition-colors duration-200 transform bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-blue-800"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : "Let's Go"}
            </button>
          </div>
        </div>
      </div>
      <div className="px-8 py-4 bg-blue-200 dark:bg-zinc-800">
        <div className="text-sm text-blue-900 dark:text-blue-300 text-center">
          Don&apos;t have an account?{' '}
          <a className="font-medium underline" href="/register">
            Sign up
          </a>
        </div>
      </div>
    </form>
  );
}
