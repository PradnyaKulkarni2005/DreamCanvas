import { NextRequest, NextResponse } from "next/server";

type ExplainRequest = {
  description: string;
  prediction: 0 | 1; // 1 = Fake, 0 = Real
};

export async function POST(req: NextRequest) {
  try {
    const body: ExplainRequest = await req.json();

    if (!body.description || body.prediction === undefined) {
      return NextResponse.json(
        { error: "Missing job description or prediction" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const label = body.prediction === 1 ? "FAKE" : "REAL";

    const systemPrompt = `
You are an AI system that explains job fraud detection results.

The ML model classified this job as: ${label}

Your task:
- Explain WHY this classification makes sense
- Use bullet points
- Focus on language patterns, missing info, promises, or realism
- Do NOT invent facts
- Be clear and helpful
- End with practical advice

Output format:
- Short explanation bullets
- One short advice paragraph with few and simple sentences
`;

    const userPrompt = `
Job Description:
"""
${body.description}
"""
`;

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 400,
        }),
      }
    );

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error("GROQ error:", err);
      return NextResponse.json(
        { error: "Failed to generate explanation" },
        { status: 500 }
      );
    }

    const data = await groqRes.json();
    const explanation = data.choices?.[0]?.message?.content;

    return NextResponse.json({
      explanation,
    });
  } catch (error) {
    console.error("Explain job error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
