// app/(app)/notes/[id]/share-controls.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Globe, Link as LinkIcon, Lock } from "lucide-react";
import { enableNoteShare, disableNoteShare } from "@/actions/note";
import { toast } from "@/ui/sonner";
import { cn } from "@/lib/utils";

type Props = {
  noteId: string;
  isPublic: boolean;
  shareToken: string | null;
};

export function ShareControls({ noteId, isPublic, shareToken }: Props) {
  const [publicState, setPublicState] = useState(isPublic);
  const [token, setToken] = useState(shareToken);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function toggleVisibility() {
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
        setToken(result.shareToken);
        toast("Note is now public. Anyone with the link can view it.", {
          icon: <Globe className="size-4" strokeWidth={1.8} />,
        });
      }
    });
  }

  async function handleCopyLink() {
    if (!publicState || !token) return;
    const full = `${window.location.origin}/share/notes/${token}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast("Link copied to clipboard.", {
        icon: <LinkIcon className="size-4" strokeWidth={1.8} />,
      });
    } catch {
      toast("Couldn't copy the link.", {
        icon: <LinkIcon className="size-4" strokeWidth={1.8} />,
      });
    }
  }

  const linkEnabled = publicState && !!token;

  return (
    <div className="flex items-center justify-end gap-3">
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={isPending}
          aria-label={publicState ? "Make note private" : "Make note public"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors",
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

        <button
          type="button"
          onClick={handleCopyLink}
          disabled={!linkEnabled}
          aria-label={
            linkEnabled ? "Copy share link" : "Share link unavailable"
          }
          title={
            linkEnabled
              ? copied
                ? "Copied"
                : "Copy link"
              : "Make the note public to copy the link"
          }
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-md transition-colors",
            linkEnabled
              ? "text-muted-foreground hover:bg-muted hover:text-foreground"
              : "cursor-not-allowed text-muted-foreground/35",
          )}
        >
          {copied ? (
            <Check className="size-3.5" strokeWidth={1.8} />
          ) : (
            <LinkIcon className="size-3.5" strokeWidth={1.8} />
          )}
        </button>
      </div>

      <Link
        href={`/notes/${noteId}/edit`}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Edit
      </Link>
    </div>
  );
}
