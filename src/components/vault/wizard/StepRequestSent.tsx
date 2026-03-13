"use client";

import { Button } from "@/components/ui/Button";

interface StepRequestSentProps {
  recipientNames: string;
  onDone: () => void;
}

export function StepRequestSent({ recipientNames, onDone }: StepRequestSentProps) {
  return (
    <div className="animate-fade-in flex flex-col items-center text-center py-12">
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
        <svg
          className="w-9 h-9 text-emerald-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-emerald-100">
        Sent
      </span>
      <h2 className="font-heading text-2xl text-stone-900 mb-3">
        Your request to {recipientNames} has been sent.
      </h2>
      <p className="text-stone-500 text-sm mb-10 max-w-xs leading-relaxed">
        {recipientNames} will receive your message and can record something special for you.
      </p>
      <Button variant="primary" size="lg" onClick={onDone}>
        Back to dashboard
      </Button>
    </div>
  );
}
