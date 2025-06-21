
import { NextRequest, NextResponse } from 'next/server';
// This API route searches YouTube for videos based on a query string
// It returns a JSON response with the video titles, IDs, channels, and thumbnails
export async function POST(req: NextRequest) {
    // Parse the request body to get the search query
  const { query } = await req.json();
// If the query is missing, return a 400 error response
  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }
// URLSearchParams is used to construct the query parameters for the YouTube API request
//query parameters include part, q, type, maxResults, and key
  const searchParams = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '3',
    key: process.env.YOUTUBE_API_KEY!,
  });
    // Fetch the YouTube API with the constructed search parameters

  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);
  //stores the response from the YouTube API
  const data = await res.json();
// results is an array of video objects, each containing title, videoId, channel, and thumbnail is mapped from the API response
  const results = data.items.map((item: any) => ({
    title: item.snippet.title,
    videoId: item.id.videoId,
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.medium.url,
  }));

  return NextResponse.json(results);
}
