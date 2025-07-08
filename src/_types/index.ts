// RoadmapItem - Represents a single item in the roadmap with a day and associated topics
export interface RoadmapItem {
  id: string;
  user_id: string;
  day: number;
  topics?: string[]; // optional for flexibility
  topic?: string;    // legacy or fallback
  subtasks: string[];
}

// VideoResult - Represents a video search result with title, video ID, thumbnail, and channel name
export interface VideoResult {
  title: string;
  videoId: string;
  thumbnail: string;
  channel: string;
}
