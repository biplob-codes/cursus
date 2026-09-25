"use client";

import { useState } from "react";
import { NotebookPen, X } from "lucide-react";
import { Textarea } from "@/ui/textarea";

export function NoteField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(value.length > 0);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full"
      >
        <NotebookPen className="h-4 w-4" />
        Add note
      </button>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="note"
          className="text-sm my-2 font-medium text-foreground"
        >
          Note
        </label>
        <button
          type="button"
          onClick={() => {
            onChange("");
            setIsOpen(false);
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove note</span>
        </button>
      </div>
      {/* name="note" lives on the real input, so this is what the form submits —
          no separate hidden field needed. */}
      <Textarea
        id="note"
        name="note"
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="What's this plan for?"
      />
    </div>
  );
}
