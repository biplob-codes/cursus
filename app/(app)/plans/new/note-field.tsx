"use client";

import { useEffect, useRef, useState } from "react";
import { NotebookPen } from "lucide-react";

export function NoteField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(value.length > 0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  // Grow with content — no scrollbar
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value, isOpen]);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <NotebookPen className="h-4 w-4" />
        Add note
      </button>
    );
  }

  return (
    <textarea
      ref={textareaRef}
      id="note"
      name="note"
      rows={1}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="What's this plan for?"
      className="w-full resize-none overflow-hidden bg-transparent px-2 py-1.5 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50 field-sizing-content"
    />
  );
}
