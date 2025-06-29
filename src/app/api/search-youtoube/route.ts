import { NextRequest, NextResponse } from 'next/server';

type RequestBody = {
  query: string;
  target?: string;
};

type YouTubeVideoItem = {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
};

type YouTubeResult = {
  title: string;
  videoId: string;
  channel: string;
  thumbnail: string;
};

export async function POST(req: NextRequest) {
  try {
    const { query, target }: RequestBody = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.error('Missing YOUTUBE_API_KEY');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const finalQuery = target ? `${query} ${target}` : query;
    const searchParams = new URLSearchParams({
      part: 'snippet',
      q: finalQuery,
      type: 'video',
      maxResults: '6',
      key: apiKey,
    });

    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('YouTube API error:', res.status, errorBody);
      return NextResponse.json({ error: 'YouTube API request failed' }, { status: 500 });
    }

    const data = await res.json();

    if (!data.items) {
      console.error('No items in response:', data);
      return NextResponse.json({ error: 'YouTube API response malformed' }, { status: 500 });
    }

    const results: YouTubeResult[] = (data.items as YouTubeVideoItem[]).map((item) => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));

    return NextResponse.json(results);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Unexpected error:', err.message);
    } else {
      console.error('Unexpected error:', err);
    }

    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
