"use client";

import { useState, useRef, useEffect } from "react";
import type { Contact, PersonOrMultiple } from "@/types";
import { getContacts, saveContact } from "@/lib/storage/contacts";
import { generateContactId } from "@/lib/utils/ids";
import { Button } from "@/components/ui/Button";

interface StepContactPickerProps {
  mode: PersonOrMultiple;
  initialValue: Contact[];
  onNext: (contacts: Contact[]) => void;
  onBack: () => void;
  heading?: string;
}

export function StepContactPicker({
  mode,
  initialValue,
  onNext,
  onBack,
  heading,
}: StepContactPickerProps) {
  const [contacts, setContacts] = useState<Contact[]>(() => getContacts());
  const [selected, setSelected] = useState<Contact[]>(initialValue);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = contacts.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const trimmedSearch = search.trim();
  const exactMatch = contacts.some(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase() === trimmedSearch.toLowerCase()
  );
  const canAddNew = trimmedSearch.length > 0 && !exactMatch;

  const isSelected = (c: Contact) => selected.some((s) => s.id === c.id);

  const toggle = (c: Contact) => {
    if (mode === "one") {
      setSelected([c]);
      setSearch("");
      setOpen(false);
    } else {
      setSelected((prev) =>
        isSelected(c) ? prev.filter((s) => s.id !== c.id) : [...prev, c]
      );
      setSearch("");
    }
  };

  const addNew = () => {
    const parts = trimmedSearch.split(/\s+/);
    const firstName = parts[0] ?? trimmedSearch;
    const lastName = parts.slice(1).join(" ");
    const newContact: Contact = {
      id: generateContactId(),
      firstName,
      lastName,
    };
    saveContact(newContact);
    setContacts((prev) => [...prev, newContact]);
    toggle(newContact);
  };

  const removeSelected = (id: string) =>
    setSelected((prev) => prev.filter((c) => c.id !== id));

  const canContinue = selected.length > 0;

  return (
    <div className="animate-slide-up">
      <BackButton onClick={onBack} />
      <h2 className="font-heading text-3xl text-stone-900 mb-3">
        {heading ?? "Who are you recording this for?"}
      </h2>
      <p className="text-stone-500 text-sm mb-10">
        {mode === "one"
          ? "Search for a contact or add a new one."
          : "Add everyone you're recording for."}
      </p>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-100 text-sm font-medium px-3 py-1 rounded-full"
            >
              {c.firstName} {c.lastName}
              <button
                type="button"
                onClick={() => removeSelected(c.id)}
                className="text-rose-400 hover:text-rose-600 transition-colors"
                aria-label={`Remove ${c.firstName}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input + dropdown */}
      <div className="relative mb-6">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search or add a name…"
          className="w-full bg-white border border-stone-200 text-stone-800 placeholder-stone-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all"
          autoFocus
        />

        {open && (filtered.length > 0 || canAddNew) && (
          <div
            ref={dropdownRef}
            className="absolute z-10 top-full mt-1.5 left-0 right-0 bg-white border border-stone-200 rounded-xl shadow-warm-md overflow-hidden"
          >
            {filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-stone-50 transition-colors ${isSelected(c) ? "bg-rose-50 text-rose-700" : "text-stone-800"}`}
              >
                <span>
                  {c.firstName} {c.lastName}
                </span>
                {isSelected(c) && (
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            ))}
            {canAddNew && (
              <button
                type="button"
                onClick={addNew}
                className="w-full text-left px-4 py-2.5 text-sm text-rose-600 font-medium hover:bg-rose-50 transition-colors border-t border-stone-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add &ldquo;{trimmedSearch}&rdquo;
              </button>
            )}
          </div>
        )}
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!canContinue}
        onClick={() => canContinue && onNext(selected)}
      >
        Continue
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
