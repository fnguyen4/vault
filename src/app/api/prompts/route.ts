import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { PromptsRequest } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildUserMessage(req: PromptsRequest): string {
  const lines: string[] = [];

  if (req.vaultFor === "for_someone_else" && req.recipientName) {
    lines.push(
      `Someone is recording a heartfelt video message TO ${req.recipientName} — not about themselves, but specifically for ${req.recipientName} to watch.`
    );
    lines.push(
      `The prompts must guide the recorder to speak directly TO ${req.recipientName}: what they want ${req.recipientName} to know, feel, or remember. ` +
      `The recorder's own life story is only relevant if it relates to ${req.recipientName} (e.g., a shared memory, what ${req.recipientName} means to them).`
    );
  } else {
    lines.push(
      "Someone is recording a video message for their own future self to watch one day."
    );
    lines.push(
      "The prompts should guide them to reflect on who they are right now: their feelings, hopes, memories, and what they want their future self to remember about this moment in their life."
    );
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
        "You are a compassionate assistant helping people record heartfelt video time capsule messages. " +
        "Your job is to generate recording prompts — sentences that guide the person on what to say in their video. " +
        "CRITICAL: When the message is for someone else, every prompt must be written from the recorder's perspective speaking TO the recipient " +
        "(e.g. 'Tell [name] what their friendship has meant to you', not 'Describe your own life'). " +
        "When the message is for the recorder's future self, prompts should help them reflect on who they are right now. " +
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
      const forSomeoneElse = body.vaultFor === "for_someone_else";
      prompts = matches
        ? matches.map((s) => s.slice(1, -1))
        : forSomeoneElse
        ? [
            "Tell them what they mean to you and why you wanted to record this message.",
            "Share a favourite memory you have with them.",
            "Tell them something you've always wanted them to know.",
            "Share your hopes and wishes for their future.",
          ]
        : [
            "Describe who you are right now and what's most important to you.",
            "Share a memory from this time in your life you never want to forget.",
            "What do you hope your future self remembers about today?",
            "Share what you're most looking forward to in the years ahead.",
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
