'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/libs/supabaseClient';
import VideoCard from './VideoCard';
import Swal from 'sweetalert2';
import { RoadmapItem, VideoResult } from '@/types';
// takes a list of roadmap items and returns a list of video cards
export default function DaySection({
  item,
  videoMap,
}: {
  item: RoadmapItem & { topics?: string[]; topic?: string; subtasks?: string[] };
  videoMap: Record<string, VideoResult[]>;
}) {
  // topics is an array of strings, topic is a single string
  const topics = Array.isArray(item.topics)
    ? item.topics
    : item.topic
    ? [item.topic]
    : [];
// usestates for storing the daily completions 
//Record - key is the topic and value is the completion status
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  // for userid 
  const [userId, setUserId] = useState<string | null>(null);

// get the user id from the supabase client
  useEffect(() => {
    const getUser = async () => {
      // get the user id from the supabase client
      const {
        data: { session },
      } = await supabase.auth.getSession();
      // if there is a session, get the user id
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    getUser();
  }, []);
// fetch the progress
  useEffect(() => {
    const fetchProgress = async () => {
      // if there is a user id, fetch the progress
      if (!userId) return;
      // fetch the progress from the supabase client
      const { data } = await supabase
        .from('progress')
        .select('task, completed')
        .eq('user_id', userId)
        .eq('day', `Day ${item.day}`);
// update the completed state with the fetched progress
      if (data) {
        const initial: Record<string, boolean> = {};
        // loop through the fetched progress and update the completed state
        data.forEach((entry) => {
          initial[entry.task] = entry.completed;
        });
        setCompleted(initial);
      }
    };

    fetchProgress();
  }, [userId, item.day]);
  // handle the completion of a task

  const handleToggle = async (topic: string) => {
    // if there is a user id, update the progress
    if (!userId) return;
//If there’s no logged-in user (userId is null or undefined), exit early — no operation allowed.
    const newValue = !completed[topic];
    // Flip the completion status for the given topic — true becomes false, and vice versa.
    
    setCompleted((prev) => ({ ...prev, [topic]: newValue }));
// update the progress in the supabase client
    await supabase.from('progress').upsert(
      {
        user_id: userId,
        day: `Day ${item.day}`,
        task: topic,
        completed: newValue,
      },
      { onConflict: 'user_id,day,task' }
    );
   // Exit if task was unchecked or already marked as complete before (prevents XP/streaks from stacking on repeated clicks).
    if (!newValue || completed[topic]) return;
// Fetch the current user's streak and points from the users table.
    const { data: userData } = await supabase
      .from('users')
      .select('streak, points')
      .eq('id', userId)
      .single();
// update points and streak
    const newXP = (userData?.points || 0) + 50;
    const newStreak = (userData?.streak || 0) + 1;
// update the user data in the supabase client
    await supabase
      .from('users')
      .update({ points: newXP, streak: newStreak })
      .eq('id', userId);
// Get a list of badge names already earned by the user.
    const { data: awardedBadges } = await supabase
      .from('badges')
      .select('badge_name')
      .eq('user_id', userId);
// Check if the user has already earned the badge for the current day.
    const alreadyAwarded = (name: string) =>
      awardedBadges?.some((b) => b.badge_name === name);

    // ✅ Day 1 Start Badge
    // Count all completed tasks for the user.
    const { count: completedTotal } = await supabase
      .from('progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true);
// if completedtotal is one then insert the badge in badges table
    if (completedTotal === 1 && !alreadyAwarded('Day 1 Start')) {
      await supabase.from('badges').insert({
        user_id: userId,
        badge_name: 'Day 1 Start',
      });
// alert
      await Swal.fire({
        title: '🌟 First Step!',
        text: 'You earned the "Day 1 Start" badge! Great beginning!',
        imageUrl: '/badges/day1_start.png',
        imageHeight: 100,
        icon: 'info',
      });
    }

    // ✅ Streak badges (3, 7, 14)
    const milestones = [3, 7, 14];
    // Loop through each milestone and check if the user has reached it.
    if (milestones.includes(newStreak)) {
      // badgename is the name of the badge
      const badgeName = `${newStreak}-Day Streak`;
      // image of the badge
      const badgeImage = `/badges/streak_${newStreak}.png`;
// insert them into badges table
      if (!alreadyAwarded(badgeName)) {
        await supabase.from('badges').insert({
          user_id: userId,
          badge_name: badgeName,
        });
// alert
        await Swal.fire({
          title: `🔥 ${newStreak}-Day Streak!`,
          text: `You earned the "${badgeName}" badge! Keep it up!`,
          imageUrl: badgeImage,
          imageHeight: 100,
          icon: 'info',
        });
      }
    }

    // ✅ Ultimate Finisher badge (after 30 completed)
    if (completedTotal === 30 && !alreadyAwarded('Ultimate Finisher')) {
      await supabase.from('badges').insert({
        user_id: userId,
        badge_name: 'Ultimate Finisher',
      });
// alert
      await Swal.fire({
        title: '🏆 All Done!',
        text: 'You completed every task! Ultimate Finisher badge awarded!',
        imageUrl: '/badges/ultimate_finisher.png',
        imageHeight: 100,
        confirmButtonColor: '#FFD700',
      });
    }

    // ✅ XP Toast
    Swal.fire({
      title: '✅ Completed',
      text: `You earned 50 XP for completing "${topic}".`,
      icon: 'success',
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
        Day {item.day}
      </h2>

      {topics.map((topic) => (
        <div key={topic} className="mb-6 border-b border-gray-700 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={!!completed[topic]}
              onChange={() => handleToggle(topic)}
              className="w-5 h-5"
            />
            <h3
              className={`text-lg font-medium text-white ${
                completed[topic] ? 'line-through text-gray-400' : ''
              }`}
            >
              {topic}
            </h3>
          </div>

          {item.subtasks && item.subtasks.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-white mb-2">
                Subtasks
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {item.subtasks.map((subtask, i) => (
                  <li key={i}>{subtask}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoMap[topic]?.length > 0 ? (
              videoMap[topic].map((video) => (
                <VideoCard key={video.videoId} video={video} />
              ))
            ) : (
              <p className="text-gray-400">Loading videos...</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
