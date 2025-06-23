'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [loading, setLoading] = useState(false);
  const router = useRouter();

 const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert('Registration successful!');
      router.push('/login');
    } else {
      alert(data.error || 'Registration failed');
    }
  } catch (err) {
    setLoading(false);
    alert('Something went wrong. Please try again.');
    console.error('Register error:', err);
  }
};

  return (
    <form
      onSubmit={handleRegister}
      className="bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl overflow-hidden border-4 border-blue-400 dark:border-blue-800 max-w-md mx-auto mt-20"
    >
      <div className="px-8 py-10 md:px-10">
        <h2 className="text-4xl font-extrabold text-center text-zinc-800 dark:text-white">
          Create an Account
        </h2>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mt-3">
          Join us and get started.
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
          <div>
        
            <label
              className="block mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-200 mt-6"
              htmlFor="full_name"
            >
              Full Name
            </label>
            <input
              placeholder="John Doe"
              className="block w-full px-4 py-3 mt-2 text-zinc-800 bg-white border-2 rounded-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-opacity-50 focus:outline-none focus:ring focus:ring-blue-400"
              name="full_name"
              id="full_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              {loading ? 'Registering...' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
      <div className="px-8 py-4 bg-blue-200 dark:bg-zinc-800">
        <div className="text-sm text-blue-900 dark:text-blue-300 text-center">
          Already have an account?{' '}
          <a className="font-medium underline" href="/login">
            Log in
          </a>
        </div>
      </div>
    </form>
  );
}
