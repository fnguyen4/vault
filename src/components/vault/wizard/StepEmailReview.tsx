"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface StepEmailReviewProps {
  recipientNames: string;
  recipientEmail: string;
  initialSubject: string;
  initialBody: string;
  onSend: (subject: string, body: string) => void;
  onBack: () => void;
}

export function StepEmailReview({
  recipientNames,
  recipientEmail,
  initialSubject,
  initialBody,
  onSend,
  onBack,
}: StepEmailReviewProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);

  return (
    <div className="animate-slide-up">
      <BackButton onClick={onBack} />
      <h2 className="font-heading text-3xl text-stone-900 mb-3">
        Your request to {recipientNames}
      </h2>
      <p className="text-stone-500 text-sm mb-8">
        Review and edit before sending.
      </p>

      <div className="bg-white border border-stone-200 rounded-2xl shadow-warm overflow-hidden mb-6">
        {/* To */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-stone-100">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider w-14 flex-shrink-0">
            To
          </span>
          <span className="text-sm text-stone-500">{recipientEmail}</span>
        </div>

        {/* Subject */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-stone-100">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider w-14 flex-shrink-0">
            Subject
          </span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 text-sm text-stone-800 bg-transparent focus:outline-none"
          />
        </div>

        {/* Body */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
          className="w-full px-5 py-4 text-sm text-stone-700 bg-transparent resize-none focus:outline-none leading-relaxed"
        />
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={() => onSend(subject, body)}
      >
        Send notification to {recipientNames}
      </Button>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm mb-8 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}
