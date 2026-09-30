// app/(app)/notes/notes-toolbar.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Search, ListFilter, X } from "lucide-react";
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
  void _tags; // step 3

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchOpen, setSearchOpen] = useState(query.length > 0);
  const [searchValue, setSearchValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep local state in sync when URL changes (e.g. back/forward)
  useEffect(() => {
    setSearchValue(query);
    if (query.length > 0) setSearchOpen(true);
  }, [query]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const updateParams = useCallback(
    (patch: { q?: string; tags?: string[] }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (patch.q !== undefined) {
        const value = patch.q.trim();
        if (value) params.set("q", value);
        else params.delete("q");
      }

      if (patch.tags !== undefined) {
        if (patch.tags.length > 0) params.set("tags", patch.tags.join(","));
        else params.delete("tags");
      }

      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [pathname, router, searchParams],
  );

  function openSearch() {
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
    if (searchValue.trim()) {
      setSearchValue("");
      updateParams({ q: "" });
    }
  }

  function handleSearchChange(value: string) {
    setSearchValue(value);
    updateParams({ q: value });
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
    }
  }

  const hasQuery = query.length > 0;
  const hasTagFilter = selectedTagIds.length > 0;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        isPending && "opacity-60",
      )}
    >
      <h1 className="shrink-0 text-2xl font-semibold tracking-tight text-foreground">
        Notes
      </h1>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-0.5">
        {/* Inline search */}
        {searchOpen ? (
          <div className="flex min-w-0 max-w-xs flex-1 items-center gap-1 sm:max-w-sm">
            <Search
              className="size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.8}
            />
            <input
              ref={inputRef}
              type="search"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search notes…"
              aria-label="Search notes"
              className={cn(
                "min-w-0 flex-1 bg-transparent text-sm outline-none",
                "placeholder:text-muted-foreground/60",
                // no border, no ring, no background
                "border-0 shadow-none ring-0 focus:outline-none",
                // hide native search clear on webkit so we own the UX
                "[&::-webkit-search-cancel-button]:hidden",
              )}
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={closeSearch}
              className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground",
              )}
            >
              <X className="size-4" strokeWidth={1.8} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label="Search notes"
            onClick={openSearch}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
              hasQuery && "text-foreground",
            )}
          >
            <Search className="size-4" strokeWidth={1.8} />
          </button>
        )}

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

        <Button className="ml-1 shrink-0">
          <Link href="/notes/new">New</Link>
        </Button>
      </div>
    </div>
  );
}
