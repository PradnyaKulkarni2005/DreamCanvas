'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DownloadPDFButton from '@/app/components/DownloadPDFButton';

// Interface for a day's plan in the roadmap
interface DayPlan {
  day: number;
  topic: string;
  subtasks: string[];
}

// Interface for YouTube video data (can be used later for enhancements)
interface VideoResult {
  title: string;
  videoId: string;
  thumbnail: string;
  channel: string;
}

export default function RoadmapPage() {
  // React state hooks to manage component state
  const [roadmap, setRoadmap] = useState<DayPlan[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const [videoMap, setVideoMap] = useState<Record<string, VideoResult[]>>({});
  const [loading, setLoading] = useState(true); // Page loading state
  const [hasSaved, setHasSaved] = useState(false); // Prevent multiple saves

  const supabase = createClientComponentClient(); // Supabase client
  const router = useRouter(); // Next.js router for redirection

  /**
   * Save the roadmap to Supabase for the current user.
   * Uses UPSERT to avoid duplicate entries.
   * Relies on UNIQUE constraint (user_id, day).
   */
  const saveRoadmapToSupabase = async (roadmapToSave: DayPlan[]) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("❌ Failed to get user:", userError?.message || "User not logged in");
      return;
    }

    console.log("✅ User ID:", user.id);

    // Prepare roadmap items for upsert
    const formatted = roadmapToSave.map(item => ({
      user_id: user.id,
      day: item.day,
      topic: item.topic,
      subtasks: item.subtasks,
    }));

    // Insert or update based on UNIQUE(user_id, day)
    const { error } = await supabase
      .from("roadmap")
      .upsert(formatted, {
        onConflict: 'user_id,day', // Make sure your DB has this unique constraint
      });

    if (error) {
      console.error("❌ Upsert error:", error.message);
    } else {
      console.log("🎉 Roadmap saved (upserted) successfully");
    }
  };

  /**
   * Runs once on component mount.
   * - Verifies user authentication.
   * - Loads localStorage roadmap.
   * - Saves roadmap to Supabase (once).
   */
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      // 1. Verify user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login'); // Redirect if not logged in
        return;
      }

      // 2. Load roadmap from localStorage
      const stored = localStorage.getItem('roadmap');
      const skills = localStorage.getItem('missingSkills');
      const target = localStorage.getItem('targetRole');
      const alreadySaved = localStorage.getItem('hasSavedRoadmap'); // persistently avoids re-saving

      // 3. If roadmap exists and not saved yet, save it to Supabase
      if (stored && !hasSaved && !alreadySaved) {
        const parsed = JSON.parse(stored);
        setRoadmap(parsed); // Update state
        await saveRoadmapToSupabase(parsed); // Save to Supabase
        localStorage.setItem('hasSavedRoadmap', 'true'); // Mark as saved to prevent duplicate insertions
        setHasSaved(true); // In-memory flag
      }

      // 4. Load other user data from localStorage
      if (skills) setMissingSkills(JSON.parse(skills));
      if (target) setRole(target);

      // 5. Stop showing loading spinner
      setLoading(false);
    };

    checkAuthAndLoad();
  }, [supabase, router, hasSaved]); // Re-run if supabase or hasSaved changes

  // Display loading state while data is being retrieved
  if (loading) return <div className="text-white p-6">Loading your roadmap...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white animate-fade-in">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-4 text-emerald-400 animate-fade-in-up">
        Your Roadmap to Become a {role}
      </h1>

      {/* Skills that the user needs to learn */}
      <p className="mb-6 text-lg text-gray-300 animate-fade-in-up delay-100">
        <strong className="text-white">Skills to Learn:</strong>{' '}
        {missingSkills.length > 0 ? missingSkills.join(', ') : 'None'}
      </p>

      {/* PDF download button */}
      <DownloadPDFButton targetId="roadmap-to-print" />

      {/* Main roadmap content */}
      <div id="roadmap-to-print" className="bg-[#0d1117] text-white p-6 space-y-6">
        {/* Render each day's topic and subtasks */}
        {roadmap.map((item, index) => (
          <div
            key={item.day}
            className="bg-[#161b22] border border-emerald-700/40 shadow-lg rounded-xl p-6 hover:shadow-emerald-500/30 transition duration-300 transform hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
          >
            {/* Day and topic */}
            <p className="text-xl font-semibold text-emerald-400 mb-2">
              Day {item.day}: <span className="text-white">{item.topic}</span>
            </p>

            {/* Subtasks under each topic */}
            <ul className="list-disc list-inside pl-2 space-y-4 text-gray-300 text-sm">
              {item.subtasks.map((task, idx) => (
                <li key={idx} className="hover:text-white transition">
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
