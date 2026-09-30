// app/(app)/notes/note-visibility-toggle.tsx
"use client";

import { useState, useTransition } from "react";
import { Globe, Lock } from "lucide-react";
import { enableNoteShare, disableNoteShare } from "@/actions/note";
import { toast } from "@/ui/sonner";
import { cn } from "@/lib/utils";

type Props = {
  noteId: string;
  isPublic: boolean;
};

export function NoteVisibilityToggle({ noteId, isPublic }: Props) {
  const [publicState, setPublicState] = useState(isPublic);
  const [isPending, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      if (publicState) {
        const result = await disableNoteShare(noteId);
        if (result.status === "error") {
          toast(result.message, {
            icon: <Lock className="size-4" strokeWidth={1.8} />,
          });
          return;
        }
        setPublicState(false);
        toast("Note is now private. Only you can see it.", {
          icon: <Lock className="size-4" strokeWidth={1.8} />,
        });
      } else {
        const result = await enableNoteShare(noteId);
        if (result.status === "error") {
          toast(result.message, {
            icon: <Globe className="size-4" strokeWidth={1.8} />,
          });
          return;
        }
        setPublicState(true);
        toast("Note is now public. Anyone with the link can view it.", {
          icon: <Globe className="size-4" strokeWidth={1.8} />,
          link: {
            label: "Open",
            href: `/notes/${noteId}`,
          },
        });
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label={publicState ? "Make note private" : "Make note public"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors",
        "text-muted-foreground hover:bg-muted hover:text-foreground",
        "disabled:opacity-50",
        publicState && "text-foreground",
      )}
    >
      {publicState ? (
        <Globe className="size-3.5" strokeWidth={1.8} />
      ) : (
        <Lock className="size-3.5" strokeWidth={1.8} />
      )}
      <span>{publicState ? "Public" : "Private"}</span>
    </button>
  );
}
