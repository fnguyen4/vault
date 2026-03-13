import type { OccasionType } from "@/types";

/** Returns curated prompt suggestions personalised with the recipient's first name. */
export function getSuggestedPrompts(
  occasionType: OccasionType | null,
  recipientName: string
): string[] {
  const n = recipientName || "them";

  const name = recipientName || "you";

  switch (occasionType) {
    case "birthday":
      return [
        `Tell ${name} about your favourite memory together.`,
        `What do you love most about ${name}, and what do you want them to know?`,
        `What do you hope the year ahead holds for ${name}?`,
        `What's something you've never told ${name} about how much they mean to you?`,
        `Tell ${name} a story that captures exactly who they are to you.`,
      ];

    case "graduation":
      return [
        `Tell ${name} how proud you are — and why.`,
        `What's the one piece of advice you most want ${name} to carry into this next chapter?`,
        `What do you see when you imagine ${name}'s future?`,
        `Share a moment that showed you just how far ${name} has come.`,
        `What do you want ${name} to know and hold onto as they step into the world?`,
      ];

    case "wedding":
      return [
        `Tell ${name} what their love story means to you.`,
        `Tell ${name} the moment you knew they had found the right person.`,
        `What do you wish for ${name} and their partner as they begin their life together?`,
        `Share a memory with ${name} that you'll always treasure.`,
        `What do you most want ${name} to know and feel on their wedding day?`,
      ];

    default:
      // General memory
      return [
        `Share a memory with ${name} that you'll always hold close.`,
        `Tell ${name} what they've given you — what they've taught you or how they've changed you.`,
        `Tell ${name} what you admire most about them.`,
        `What do you most want ${name} to always remember about you, and about your relationship?`,
        `If you could say one thing to ${name}, what would it be?`,
      ];
  }
}
