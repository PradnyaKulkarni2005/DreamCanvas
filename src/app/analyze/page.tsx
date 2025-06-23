'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/libs/supabaseClient';
import Loader from '@/app/components/Loader';
import RoleSelector from '@/app/components/RoleSelector';
import '@/app/components/inputfield.css';

export default function AnalyzePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Auth check with onAuthStateChange
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setCheckingAuth(false);
      } else {
        router.replace('/login');
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setCheckingAuth(false);
      } else {
        router.replace('/login');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skills || !role) return alert("Please fill in all fields");

    setLoading(true);
    try {
      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills, role }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.roadmap) throw new Error('Invalid response.');

      localStorage.setItem('roadmap', JSON.stringify(data.roadmap));
      localStorage.setItem('missingSkills', JSON.stringify(data.missingSkills));
      localStorage.setItem('targetRole', role);

      router.push('/roadmap');
    } catch (err: any) {
      console.error("Roadmap error:", err);
      alert(err.message || "Error generating roadmap");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-[#0d1117] text-white rounded-2xl shadow-lg border border-gray-800 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-4 animate-fade-in-up">AI Skill Gap Analyzer</h1>
      <p className="text-center mb-6 text-gray-400 animate-fade-in-up delay-100">Find missing skills and get your roadmap</p>

      <div className="text-right mb-4">
        <button
          className="text-sm text-emerald-400 hover:underline"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/login');
          }}
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10 animate-pulse">
          <Loader />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Your Current Skills</label>
            <textarea
              rows={4}
              placeholder="e.g., HTML, CSS, JavaScript, React"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#161b22] border border-gray-700 placeholder-gray-500 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />
          </div>

          <RoleSelector value={role} onChange={setRole} />

          {role && <p className="text-sm text-gray-400">Selected Role: <strong className="text-emerald-400">{role}</strong></p>}

          <button
            type="submit"
            disabled={loading}
            className={`transition-all duration-500 hover:shadow-[0_15px_50px_-15px_#13b6da] p-[12px] rounded-[24px] flex items-center gap-4 bg-gradient-to-r from-[#2891c5] to-[#13b6da] transform hover:scale-105 active:scale-95 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <svg className="h-10 w-10 bg-[#0a0a0a] shadow-xl rounded-full p-2" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M15.003 14H3.5v-4h11.502l-4.165-4.538 2.705-2.947 7.353 8.012c.747.813.747 2.133 0 2.947l-7.353 8.011-2.705-2.947L15.003 14z"
                fill="#F0F0F0" />
            </svg>
            <span className="text-[1.2rem] font-semibold text-white pr-3 tracking-wide">
              {loading ? 'Generating...' : 'Generate Roadmap'}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
