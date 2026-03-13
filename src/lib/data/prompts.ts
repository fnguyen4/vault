import type { OccasionType } from "@/types";

/** Returns curated prompt suggestions personalised with the recipient's first name. */
export function getSuggestedPrompts(
  occasionType: OccasionType | null,
  recipientName: string
): string[] {
  const n = recipientName || "them";

  switch (occasionType) {
    case "birthday":
      return [
        `What's your favourite memory with ${n}?`,
        `What do you love most about ${n}?`,
        `What do you hope ${n}'s year ahead looks like?`,
        `What's something ${n} might not know about how much they mean to you?`,
        `What's a story that perfectly captures who ${n} is to you?`,
      ];

    case "graduation":
      return [
        `What are you most proud of about ${n}?`,
        `What's the one piece of advice you most want ${n} to carry into this next chapter?`,
        `What do you see when you imagine ${n}'s future?`,
        `What's a moment that showed you just how far ${n} has come?`,
        `What do you want ${n} to know as they step into the world?`,
      ];

    case "wedding":
      return [
        `What does ${n}'s love story mean to you?`,
        `When did you know ${n} had found the right person?`,
        `What do you wish for ${n} and their partner as they begin their life together?`,
        `What's a memory with ${n} that you'll always treasure?`,
        `What do you most want ${n} to know and feel on their wedding day?`,
      ];

    default:
      // General memory
      return [
        `What's your most treasured memory with ${n}?`,
        `What has ${n} taught you, or how have they changed you?`,
        `What do you admire most about ${n}?`,
        `What do you most want ${n} to always remember about you and your relationship?`,
        `If you could tell ${n} one thing, what would it be?`,
      ];
  }
}
