"use client";

import { useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type TagOption = { id: string; name: string };

type Props = {
  existingTags: TagOption[];
  selectedIds: string[];
  newNames: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  onNewNamesChange: (names: string[]) => void;
};

export function NoteTagPicker({
  existingTags,
  selectedIds,
  newNames,
  onSelectedIdsChange,
  onNewNamesChange,
}: Props) {
  const [query, setQuery] = useState("");

  const selectedExisting = useMemo(
    () => existingTags.filter((t) => selectedIds.includes(t.id)),
    [existingTags, selectedIds],
  );

  const normalizedQuery = query.trim();
  const queryLower = normalizedQuery.toLowerCase();

  const suggestions = useMemo(() => {
    if (!queryLower) return [];
    return existingTags.filter(
      (t) =>
        t.name.toLowerCase().includes(queryLower) &&
        !selectedIds.includes(t.id),
    );
  }, [existingTags, queryLower, selectedIds]);

  const canCreate =
    normalizedQuery.length > 0 &&
    !existingTags.some((t) => t.name.toLowerCase() === queryLower) &&
    !newNames.some((n) => n.toLowerCase() === queryLower);

  function addExisting(tag: TagOption) {
    onSelectedIdsChange([...selectedIds, tag.id]);
    setQuery("");
  }

  function addNew(name: string) {
    onNewNamesChange([...newNames, name.trim()]);
    setQuery("");
  }

  function removeExisting(id: string) {
    onSelectedIdsChange(selectedIds.filter((x) => x !== id));
  }

  function removeNew(name: string) {
    onNewNamesChange(newNames.filter((n) => n !== name));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length === 1) {
        addExisting(suggestions[0]);
        return;
      }
      if (canCreate) {
        addNew(normalizedQuery);
      }
    }
    if (e.key === "Backspace" && query === "") {
      if (newNames.length > 0) {
        removeNew(newNames[newNames.length - 1]);
      } else if (selectedIds.length > 0) {
        removeExisting(selectedIds[selectedIds.length - 1]);
      }
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Tags</label>

      <div
        className={cn(
          "flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-border bg-transparent px-2 py-1.5",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        )}
      >
        {selectedExisting.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs text-foreground"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeExisting(tag.id)}
              className="rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label={`Remove ${tag.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {newNames.map((name) => (
          <span
            key={`new-${name}`}
            className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-xs text-primary"
          >
            {name}
            <button
              type="button"
              onClick={() => removeNew(name)}
              className="rounded p-0.5 text-primary/70 hover:text-primary"
              aria-label={`Remove ${name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            selectedExisting.length + newNames.length === 0 ? "Add a tag…" : ""
          }
          className="min-w-[8rem] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
        />
      </div>

      {(suggestions.length > 0 || canCreate) && normalizedQuery && (
        <ul className="overflow-hidden rounded-lg border border-border bg-popover shadow-sm">
          {suggestions.map((tag) => (
            <li key={tag.id}>
              <button
                type="button"
                onClick={() => addExisting(tag)}
                className="flex w-full items-center px-3 py-1.5 text-left text-sm text-foreground hover:bg-muted"
              >
                {tag.name}
              </button>
            </li>
          ))}
          {canCreate && (
            <li>
              <button
                type="button"
                onClick={() => addNew(normalizedQuery)}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-foreground hover:bg-muted"
              >
                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                Create “{normalizedQuery}”
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
