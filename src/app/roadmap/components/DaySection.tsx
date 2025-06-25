import VideoCard from './VideoCard';
import { RoadmapItem, VideoResult } from '@/types';
// takes a roadmap item and a video map, rendering the day's section with topics and videos
export default function DaySection({
  item,
  videoMap,
}: {
  item: RoadmapItem & { topics?: string[]; topic?: string };
  videoMap: Record<string, VideoResult[]>;
}) {
  // Normalize topics: prefer `topics`, fallback to single `topic`, else empty array
  // This ensures we handle both cases where `topics` is an array or a single string
  const topics = Array.isArray(item.topics)
    ? item.topics
    : item.topic
    ? [item.topic]
    : [];

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
        <div key={topic} className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-white">{topic}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoMap[topic] && videoMap[topic].length > 0 ? (
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
