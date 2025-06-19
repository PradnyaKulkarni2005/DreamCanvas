import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Validate API Key
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is missing from environment variables.');
}

// Create OpenAI instance
const openai = new OpenAI({
  apiKey,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { skills, role } = body;

    if (!skills || !role) {
      return NextResponse.json({ error: 'Missing fields: skills or role' }, { status: 400 });
    }

    const prompt = `
You are a career AI helping users transition into IT roles.

User has the following current skills: ${skills}
They want to become a: ${role}

1. Identify the most important missing skills they need to learn.
2. Build a personalized 30-day learning roadmap. Split it by day.
3. For each day, suggest a topic or task (don't include course links for now).

Respond in JSON like this:
{
  "missingSkills": ["skill1", "skill2"],
  "roadmap": [
    {"day": 1, "topic": "Learn basic JavaScript"},
    {"day": 2, "topic": "Practice DOM manipulation"},
    ...
  ]
}
`;

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = chatResponse.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'Invalid response from OpenAI' }, { status: 500 });
    }

    let json;
    try {
      json = JSON.parse(content);
    } catch (parseErr) {
      console.error('Failed to parse OpenAI response:', content);
      return NextResponse.json({ error: 'Invalid JSON format in response' }, { status: 500 });
    }

    return NextResponse.json(json);
  } catch (err: any) {
    console.error('API error:', err);

    if (err.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'You have exceeded your OpenAI quota. Please check your billing settings.' },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
