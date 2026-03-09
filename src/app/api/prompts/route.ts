import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { PromptsRequest } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildUserMessage(req: PromptsRequest): string {
  const lines: string[] = [];

  if (req.vaultFor === "for_someone_else" && req.recipientName) {
    lines.push(`This vault is being recorded for ${req.recipientName}.`);
  } else {
    lines.push("This vault is being recorded by someone for themselves.");
  }

  if (req.purpose === "specific_occasion" && req.occasionName) {
    lines.push(`The occasion is: ${req.occasionName}.`);
  } else {
    lines.push("There is no specific occasion — it's a general memory.");
  }

  if (req.title) lines.push(`Vault title: "${req.title}".`);
  if (req.description) lines.push(`Additional context: ${req.description}.`);

  lines.push(
    "\nGenerate 4 heartfelt, specific, emotionally resonant recording prompts for this video message. " +
      "Each prompt should be a single sentence that guides the person on what to say or share. " +
      "Make them personal, warm, and evocative. " +
      "Return ONLY a valid JSON array of strings, no other text. Example: [\"Prompt one\", \"Prompt two\"]"
  );

  return lines.join(" ");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PromptsRequest;

    if (!body.vaultFor || !body.purpose) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userMessage = buildUserMessage(body);

    const message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system:
        "You are a compassionate assistant helping people craft heartfelt video time capsule messages for loved ones. " +
        "Generate warm, specific, emotionally resonant recording prompts. " +
        "Always respond with a valid JSON array of strings only — no markdown, no extra text.",
      messages: [{ role: "user", content: userMessage }],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "";

    let prompts: string[];
    try {
      // Strip markdown code fences if Claude wraps in them
      const cleaned = raw.replace(/```(?:json)?\n?/g, "").trim();
      prompts = JSON.parse(cleaned) as string[];
      if (!Array.isArray(prompts) || prompts.some((p) => typeof p !== "string")) {
        throw new Error("Invalid format");
      }
    } catch {
      // Fallback: extract strings from the response
      const matches = raw.match(/"([^"]+)"/g);
      prompts = matches ? matches.map((s) => s.slice(1, -1)) : [
        "Share what this moment means to you.",
        "Describe a memory you want them to always remember.",
        "Tell them what you love most about them.",
        "Share your hopes and wishes for their future.",
      ];
    }

    // Ensure 3-5 prompts
    prompts = prompts.slice(0, 5);

    return NextResponse.json({ prompts });
  } catch (e) {
    console.error("[/api/prompts]", e);
    return NextResponse.json(
      { error: "Failed to generate prompts" },
      { status: 500 }
    );
  }
}
