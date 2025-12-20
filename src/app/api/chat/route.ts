import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
// ChatRequestBody defines the expected structure of the request body for the chat API.
type ChatRequestBody = {
  messages: ChatMessage[];
  context?: {
    targetRole?: string;
    currentSkills?: string[];
    roadmap?: string[];
    jobDescription?: string;
    jobAuthenticity?: "Real" | "Fake";
  };
};

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("Missing GROQ_API_KEY");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    /* ---------- SYSTEM PROMPT (Career Coach) ---------- */
    const systemPrompt = `
You are an AI Career Coach.

Your goal:
- Give clear, practical career advice
- Help users become job-ready
- Suggest next learning steps
- Be concise, supportive, and realistic

User context:
Target role: ${body.context?.targetRole ?? "Not specified"}
Current skills: ${body.context?.currentSkills?.join(", ") ?? "Not specified"}
Learning roadmap: ${body.context?.roadmap?.join(" → ") ?? "Not specified"}
Job authenticity: ${body.context?.jobAuthenticity ?? "Unknown"}

If a job description is provided, consider it carefully and give honest advice.
Do NOT hallucinate company-specific facts.
`;

    /* ---------- BUILD FINAL MESSAGE LIST ---------- */
    const messages = [
      { role: "system", content: systemPrompt },
      ...body.messages,
    ];

    /* ---------- CALL GROQ ---------- */
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          temperature: 0.4,
          max_tokens: 500,
        }),
      }
    );
// Handle GROQ response
    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("GROQ error:", errText);
      return NextResponse.json(
        { error: "AI service failed" },
        { status: 500 }
      );
    }
// Parse GROQ response
    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content;
// Check for empty reply
    if (!reply) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
