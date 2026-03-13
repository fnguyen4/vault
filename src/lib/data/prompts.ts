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
        `Share a story that perfectly captures who ${n} is.`,
      ];

    case "graduation":
      return [
        `What are you most proud of about ${n}?`,
        `What advice would you give ${n} as they start this new chapter?`,
        `What do you think ${n}'s future holds?`,
        `Share a moment that showed you how far ${n} has come.`,
        `What's your wish for ${n} as they step into the world?`,
      ];

    case "wedding":
      return [
        `What does ${n}'s relationship mean to you?`,
        `When did you know ${n} had found the right person?`,
        `What do you wish for ${n} and their partner in their life together?`,
        `Share a memory of ${n} that you'll always treasure.`,
        `What do you want ${n} to know on their wedding day?`,
      ];

    default:
      // General memory
      return [
        `What's your most treasured memory with ${n}?`,
        `What has ${n} taught you?`,
        `What do you admire most about ${n}?`,
        `What do you want ${n} to always remember?`,
        `If you could tell ${n} one thing, what would it be?`,
      ];
  }
}
