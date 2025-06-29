//NextRequest - handles incoming requests in Next.js API routes
// NextResponse - used to send responses back to the client
import { NextRequest, NextResponse } from 'next/server';
// axios - promise-based HTTP client for the browser and Node.js
// jsonrepair - library to repair malformed JSON strings
import axios from 'axios';
import { jsonrepair } from 'jsonrepair';
// load environment variables from .env file
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
// MODEL - the specific model to use for the API request
const MODEL = 'llama3-70b-8192';
// post function - handles POST requests to the API route
export async function POST(req: NextRequest) {
  try {
    // takes the request body 
    const body = await req.json();
    const { skills, role } = body;

    if (!skills || !role) {
      return NextResponse.json({ error: 'Missing fields: skills or role' }, { status: 400 });
    }
// prompt - the message sent to the LLaMA model to generate a personalized learning roadmap
    const prompt = `
You are a helpful career assistant.

The user wants to become a "${role}". They currently have these skills: ${skills}.

1. Identify  essential skills they are missing.
2. Build a 30-day learning roadmap.
3. For each day, include:
   - "day" (number)
   - "topic" (short descriptive title)
   - "subtasks" (2–4 bullet points)
4.Dont fail to give subtasks for each day.
Respond ONLY in JSON using this format:

{
  "missingSkills": ["skill1", "skill2", ...],
  "roadmap": [
    { "day": 1, "topic": "Title", "subtasks": ["task1", "task2"] },
    ...
  ]
}
Do not include markdown or explanations.
`;
// response - sends a POST request to the LLaMA API with the prompt and model details
    const response = await axios.post(
      GROQ_URL,
      {
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
// Check if the response contains choices and message content
    const content = response.data.choices?.[0]?.message?.content;
    console.log("🧠 Raw LLaMA Response:", content);

    let json;
    try {
      // Strip potential markdown code fences or extra noise
      // This regex captures JSON content within code blocks or directly
      // It handles both fenced code blocks (```json) and plain JSON
      const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      // If no match, use the content directly
      // This allows for flexibility in how the JSON is formatted in the response
      const rawJson = match ? match[1] : content;

      // Clean and repair malformed JSON
      const repaired = jsonrepair(rawJson);
      json = JSON.parse(repaired);
    } catch (parseErr) {
      console.error('❌ JSON parsing failed:', parseErr);
      return NextResponse.json({ error: 'Invalid JSON format in LLM response' }, { status: 500 });
    }
// Validate the structure of the JSON response
    if (!json.roadmap || !Array.isArray(json.roadmap)) {
      return NextResponse.json({ error: 'Response missing valid roadmap array' }, { status: 500 });
    }

    return NextResponse.json(json);
 } catch (err: unknown) {
  let errorMessage = 'Unknown error';

  if (err instanceof Error) {
    errorMessage = err.message;
    console.error('❌ API error:', err.message);
  } else {
    console.error('❌ API error:', err);
  }

  return NextResponse.json(
    { error: 'Failed to fetch roadmap from LLaMA 3', detail: errorMessage },
    { status: 500 }
  );
}

}
