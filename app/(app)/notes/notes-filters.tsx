"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type TagOption = { id: string; name: string };

export function NotesFilters({
  tags,
  selectedTagIds,
  query,
}: {
  tags: TagOption[];
  selectedTagIds: string[];
  query: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

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

  function toggleTag(id: string) {
    const next = selectedTagIds.includes(id)
      ? selectedTagIds.filter((t) => t !== id)
      : [...selectedTagIds, id];
    updateParams({ tags: next });
  }

  function clearAll() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  const hasFilters = query.length > 0 || selectedTagIds.length > 0;

  return (
    <div
      className={cn("space-y-3 transition-opacity", isPending && "opacity-60")}
    >
      {/* Title search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          defaultValue={query}
          placeholder="Filter by title…"
          onChange={(e) => updateParams({ q: e.target.value })}
          className={cn(
            "h-9 w-full rounded-lg border border-border bg-transparent pl-8 pr-3 text-sm outline-none",
            "placeholder:text-muted-foreground/50",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          )}
        />
      </div>

      {/* Tag chips */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => {
            const active = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={cn(
                  "inline-flex h-7 items-center rounded-md px-2 text-[13px] transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {tag.name}
              </button>
            );
          })}
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[13px] text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
