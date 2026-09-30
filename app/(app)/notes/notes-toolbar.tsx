// app/(app)/notes/notes-toolbar.tsx
"use client";

import Link from "next/link";
import { Search, ListFilter } from "lucide-react";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";

export type TagOption = { id: string; name: string };

type NotesToolbarProps = {
  tags: TagOption[];
  selectedTagIds: string[];
  query: string;
};

export function NotesToolbar({
  tags: _tags,
  selectedTagIds,
  query,
}: NotesToolbarProps) {
  // tags / selectedTagIds / query used in steps 2–3
  void _tags;

  const hasQuery = query.length > 0;
  const hasTagFilter = selectedTagIds.length > 0;

  return (
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Notes
      </h1>

      <div className="flex items-center gap-0.5">
        {/* Search — behavior in step 2 */}
        <button
          type="button"
          aria-label="Search notes"
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground",
            hasQuery && "text-foreground",
          )}
        >
          <Search className="size-4" strokeWidth={1.8} />
        </button>

        {/* Filter — behavior in step 3 */}
        <button
          type="button"
          aria-label="Filter by tags"
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground",
            hasTagFilter && "text-foreground",
          )}
        >
          <ListFilter className="size-4" strokeWidth={1.8} />
        </button>

        <Button className="ml-1">
          <Link href="/notes/new">New</Link>
        </Button>
      </div>
    </div>
  );
}
