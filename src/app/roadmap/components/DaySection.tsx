'use client'
import { useEffect,useState } from 'react';
import { supabase } from '@/app/libs/supabaseClient';
import VideoCard from './VideoCard';
import { RoadmapItem, VideoResult } from '@/types';
import Swal from 'sweetalert2';
// takes a roadmap item and a video map, rendering the day's section with topics and videos
export default function DaySection({
  item,
  videoMap,
  userId
}: {
  item: RoadmapItem & { topics?: string[]; topic?: string };
  videoMap: Record<string, VideoResult[]>;
  userId:string
}) {
  // Normalize topics: prefer `topics`, fallback to single `topic`, else empty array
  // This ensures we handle both cases where `topics` is an array or a single string
  const topics = Array.isArray(item.topics)
    ? item.topics
    : item.topic
    ? [item.topic]
    : [];
// State to store the videos for the current day
    const  [completed, setCompleted] = useState<Record<string, boolean>>({});

    useEffect(() => {
    const fetchProgress = async () => {
      // Fetch the user's progress from Supabase
      const { data, error } = await supabase
        .from('progress')
        .select('task, completed')
        .eq('user_id', userId)
        .eq('day', `Day ${item.day}`);
// Update the state with the fetched progress
      if (data) {
        const initial: Record<string, boolean> = {};
        data.forEach((entry) => {
          initial[entry.task] = entry.completed;
        });
        setCompleted(initial);
      } else {
        console.error('Error fetching progress:', error);
      }
    };
    // debugging line
console.log("UserID",userId)
    if (userId) {
      fetchProgress();
    }
  }, [userId, item.day]);
// Render the day's section with topics and videos
  const handleToggle = async (topic: string) => {
    // Toggle the completion status of the topic
    const newValue = !completed[topic];
    // Update the state with the new completion status
    setCompleted((prev) => ({ ...prev, [topic]: newValue }));
console.log("UserID",userId)
// Insert the data into supabase
    const { error } = await supabase.from('progress').upsert(
      {
        user_id: userId,
        day: `Day ${item.day}`,
        task: topic,
        completed: newValue,
      },
      {
        onConflict: 'user_id,day,task',
      }
    );
    // 

    if (!error && newValue) {
      // alert(`✅ Completed: "${topic}" for Day ${item.day}`);
      Swal.fire(
        {
          title: "Completed",
          text: `You have completed "${topic}" for Day ${item.day}.`,
          icon: "success",
          position:"center"
        }
      )
    } else if (error) {
      console.error('Error saving progress:', error);
    }
  };


  return (
    <div className="mb-8">
      {/* Day header */}
      <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
        Day {item.day}
      </h2>

      {/* Subtasks list */}
      {item.subtasks && item.subtasks.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-white mb-2">Subtasks</h4>
          <ul className="list-disc list-inside text-sm text-gray-300">
            {item.subtasks.map((subtask, i) => (
              <li key={i}>{subtask}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Topics + Videos */}
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
