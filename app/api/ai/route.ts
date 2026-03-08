import { NextResponse } from "next/server";

type RequestBody = {
  tool?: string;
  input?: string;
};

const prompts: Record<string, string> = {
  "excel-formula-generator":
    "You are an Excel formula expert. Return a concise formula and short explanation. Output in plain text.",
  "sql-query-explainer":
    "You explain SQL queries in clear, concise plain English for developers. Output in plain text.",
};

export async function POST(request: Request) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const tool = body.tool?.trim() ?? "";
  const input = body.input?.trim() ?? "";

  if (!tool || !input) {
    return NextResponse.json({ error: "Tool and input are required." }, { status: 400 });
  }

  if (!prompts[tool]) {
    return NextResponse.json({ error: "Unsupported AI tool." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured for AI tools." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: [{ type: "input_text", text: prompts[tool] }] },
          { role: "user", content: [{ type: "input_text", text: input }] },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `OpenAI request failed: ${errorText}` },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      output_text?: string;
    };

    return NextResponse.json({ output: data.output_text ?? "No response returned." });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the AI provider. Please try again." },
      { status: 502 },
    );
  }
}
