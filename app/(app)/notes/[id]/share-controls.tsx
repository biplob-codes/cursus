"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Link2, Link2Off } from "lucide-react";
import { enableNoteShare, disableNoteShare } from "@/actions/note";
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
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const shareUrl =
    typeof window !== "undefined" && token
      ? `${window.location.origin}/share/notes/${token}`
      : token
        ? `/share/notes/${token}`
        : null;

  function handleEnable() {
    setError(null);
    startTransition(async () => {
      const result = await enableNoteShare(noteId);
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      setPublicState(true);
      setToken(result.shareToken);
    });
  }

  function handleDisable() {
    setError(null);
    startTransition(async () => {
      const result = await disableNoteShare(noteId);
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      setPublicState(false);
    });
  }

  async function handleCopy() {
    if (!shareUrl) return;
    const full = shareUrl.startsWith("http")
      ? shareUrl
      : `${window.location.origin}${shareUrl}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy the link.");
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Share</p>
          <p className="text-xs text-muted-foreground">
            {publicState
              ? "Anyone with the link can view this note."
              : "Only you can see this note."}
          </p>
        </div>

        {publicState ? (
          <button
            type="button"
            onClick={handleDisable}
            disabled={isPending}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
              "disabled:opacity-50",
            )}
          >
            <Link2Off className="h-3.5 w-3.5" strokeWidth={1.8} />
            {isPending ? "…" : "Stop sharing"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEnable}
            disabled={isPending}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              "bg-foreground text-background hover:opacity-90",
              "disabled:opacity-50",
            )}
          >
            <Link2 className="h-3.5 w-3.5" strokeWidth={1.8} />
            {isPending ? "…" : "Share"}
          </button>
        )}
      </div>

      {publicState && token && (
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={
              typeof window !== "undefined"
                ? `${window.location.origin}/share/notes/${token}`
                : `/share/notes/${token}`
            }
            className="min-w-0 flex-1 truncate rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors",
              "text-foreground hover:bg-muted",
            )}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
                Copy
              </>
            )}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
