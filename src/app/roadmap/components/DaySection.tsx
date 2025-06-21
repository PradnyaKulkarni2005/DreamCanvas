import VideoCard from './VideoCard';
import { RoadmapItem, VideoResult } from '@/types';

// DaySection component takes an item of type RoadmapItem and a videoMap that maps topics to VideoResults
export default function DaySection({
  item,
  videoMap,
}: {
  item: RoadmapItem;
  // videoMap maps topic names to arrays of VideoResults
  videoMap: Record<string, VideoResult[]>;
}) {
  return (
    <div className="mb-8">
      {/* displays daywise roadmap items */}
      <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
        Day {item.day}
      </h2>

      {item.topics.map((topic) => (
        <div key={topic} className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-white">{topic}</h3>

          {/* show videos related to the topic using VideoCard */}
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
