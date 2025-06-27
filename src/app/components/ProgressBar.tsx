'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/libs/supabaseClient';

export default function ProgressBar({ userId }: { userId: string }) {
    // State to store the progress of the user as per the day count
  const [dayCount, setDayCount] = useState(0);
  // total number of days in the roadmap
  const totalDays = 30;

  useEffect(() => {
    const fetchProgressDays = async () => {
        // fetch the progress of the user from the supabase database
      const { data, error } = await supabase
        .from('progress')
        .select('day')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching progress:', error);
        return;
      }

      // Use a Set to count unique days only
      const uniqueDays = new Set(data.map((entry) => entry.day));
      // Update the state with the count of unique days
      setDayCount(uniqueDays.size);
    };
    if (userId) fetchProgressDays();
  }, [userId]);
// calculate the progress
  const percentage = Math.min(Math.round((dayCount / totalDays) * 100), 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-white">Your Progress</span>
        <span className="text-sm text-gray-300">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-4">
        {/* progress bar */}
        <div
          className="bg-emerald-500 h-4 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        {dayCount} of {totalDays} days completed
      </p>
    </div>
  );
}
