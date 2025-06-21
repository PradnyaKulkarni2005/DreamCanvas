// RoadmapItem - Represents a single item in the roadmap with a day and associated topics
export interface RoadmapItem {
  day: string;
  topics: string[];
}
// VideoResult - Represents a video search result with title, video ID, thumbnail, and channel name
export interface VideoResult {
  title: string;
  videoId: string;
  thumbnail: string;
  channel: string;
}
