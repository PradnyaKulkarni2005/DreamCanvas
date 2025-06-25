'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DownloadPDFButton from '@/app/components/DownloadPDFButton';

// This interface defines the structure of each day's plan in the roadmap
// It includes the day number, topic, and an array of subtasks
interface DayPlan {
  day: number;
  topic: string;
  subtasks: string[];
}

export default function RoadmapPage() {
  // State variables to manage roadmap data, missing skills, user role, loading state, and save status
  const [roadmap, setRoadmap] = useState<DayPlan[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);

  const supabase = createClientComponentClient();
  const router = useRouter();
// Function to save the target role to the users table
  const saveTargetRoleToUsers = async (userId: string, role: string) => {
    const { error } = await supabase
      .from('users')
      .update({ target: role })
      .eq('id', userId);

    if (error) {
      console.error('❌ Failed to update user target:', error.message);
    } else {
      console.log('✅ User target role updated successfully');
    }
  };
// Function to save the roadmap to Supabase
// This function takes the roadmap data and the target role as parameters
// It retrieves the current user, updates their target role, and saves the roadmap items
// Each roadmap item is formatted to match the database schema before upserting
  const saveRoadmapToSupabase = async (roadmapToSave: DayPlan[], targetRole: string) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("❌ Failed to get user:", userError?.message || "User not logged in");
      return;
    }

    console.log("✅ User ID:", user.id);
// Update the user's target role in the users table
    await saveTargetRoleToUsers(user.id, targetRole);
// Format the roadmap items to match the database schema
// Each item includes the user ID, day, topic, and subtasks
    const formatted = roadmapToSave.map(item => ({
      user_id: user.id,
      day: item.day,
      topic: item.topic,
      subtasks: item.subtasks,
    }));
// Upsert the formatted roadmap items into the 'roadmap' table
// This will insert new items or update existing ones based on user_id and day
    const { error } = await supabase
      .from("roadmap")
      .upsert(formatted, {
        onConflict: 'user_id,day',
      });

    if (error) {
      console.error("❌ Upsert error:", error.message);
    } else {
      console.log("🎉 Roadmap saved (upserted) successfully");
    }
  };
// useEffect hook to check authentication and load roadmap data
  // This effect runs once when the component mounts
  // It checks if the user is authenticated, fetches their role, and loads any existing
  useEffect(() => {
    // Check if the user is authenticated and load their roadmap
    const checkAuthAndLoad = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Step 1: Fetch role (target) from users table
      let userRole = '';
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('target')
        .eq('id', user.id)
        .single();

      if (userDataError) {
        console.error('Failed to fetch user role:', userDataError.message);
      } else if (userData?.target) {
        userRole = userData.target;
        setRole(userData.target);
      }

      // Step 2: Get local storage items
      const stored = localStorage.getItem('roadmap');
      const skills = localStorage.getItem('missingSkills');
      const localTarget = localStorage.getItem('targetRole');
      const alreadySaved = localStorage.getItem('hasSavedRoadmap');

      // Step 3: Prefer database role, fallback to local
      // If userRole is not set, use localTarget as a fallback
      const effectiveRole = userRole || localTarget || '';

      // Save roadmap only if it exists and hasn't been saved before
      // This prevents overwriting existing data unnecessarily
      if (stored && !hasSaved && !alreadySaved) {
        // Parse the stored roadmap and save it to Supabase
        const parsed = JSON.parse(stored);
        setRoadmap(parsed);
        await saveRoadmapToSupabase(parsed, effectiveRole);
        localStorage.setItem('hasSavedRoadmap', 'true');
        setHasSaved(true);
      }
// Step 4: Load roadmap from local storage if available
      if (skills) setMissingSkills(JSON.parse(skills));
      if (!userRole && localTarget) setRole(localTarget); // Fallback

      setLoading(false);
    };

    checkAuthAndLoad();
  }, [supabase, router, hasSaved]);

  if (loading) return <div className="text-white p-6">Loading your roadmap...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white animate-fade-in">
      <h1 className="text-3xl font-bold mb-4 text-emerald-400 animate-fade-in-up">
        Your Roadmap to Become a {role}
      </h1>
{/* display the missing skills */}
      <p className="mb-6 text-lg text-gray-300 animate-fade-in-up delay-100">
        <strong className="text-white">Skills to Learn:</strong>{' '}
        {missingSkills.length > 0 ? missingSkills.join(', ') : 'None'}
      </p>

      <DownloadPDFButton targetId="roadmap-to-print" />
{/* loop through the roadmap and display each days topics and subtopics */}
      <div id="roadmap-to-print" className="bg-[#0d1117] text-white p-6 space-y-6">
        {roadmap.map((item, index) => (
          <div
            key={item.day}
            className="bg-[#161b22] border border-emerald-700/40 shadow-lg rounded-xl p-6 hover:shadow-emerald-500/30 transition duration-300 transform hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
          >
            <p className="text-xl font-semibold text-emerald-400 mb-2">
              Day {item.day}: <span className="text-white">{item.topic}</span>
            </p>
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
