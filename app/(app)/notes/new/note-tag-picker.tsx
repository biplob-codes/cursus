"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

type HighlightItem =
  | { kind: "existing"; tag: TagOption }
  | { kind: "create"; name: string };

export function NoteTagPicker({
  existingTags,
  selectedIds,
  newNames,
  onSelectedIdsChange,
  onNewNamesChange,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

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

  const items: HighlightItem[] = useMemo(() => {
    const list: HighlightItem[] = suggestions.map((tag) => ({
      kind: "existing" as const,
      tag,
    }));
    if (canCreate) {
      list.push({ kind: "create", name: normalizedQuery });
    }
    return list;
  }, [suggestions, canCreate, normalizedQuery]);

  const showMenu = open && items.length > 0;

  // Keep highlight in range when the list changes
  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  useEffect(() => {
    if (!showMenu || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(
      `[data-index="${highlightIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex, showMenu]);

  function addExisting(tag: TagOption) {
    onSelectedIdsChange([...selectedIds, tag.id]);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function addNew(name: string) {
    onNewNamesChange([...newNames, name.trim()]);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function removeExisting(id: string) {
    onSelectedIdsChange(selectedIds.filter((x) => x !== id));
  }

  function removeNew(name: string) {
    onNewNamesChange(newNames.filter((n) => n !== name));
  }

  function selectHighlighted() {
    const item = items[highlightIndex];
    if (!item) return;
    if (item.kind === "existing") addExisting(item.tag);
    else addNew(item.name);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      if (!showMenu) {
        setOpen(true);
        return;
      }
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % items.length);
      return;
    }

    if (e.key === "ArrowUp") {
      if (!showMenu) return;
      e.preventDefault();
      setHighlightIndex((i) => (i - 1 + items.length) % items.length);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (showMenu && items.length > 0) {
        selectHighlighted();
        return;
      }
      if (canCreate) {
        addNew(normalizedQuery);
      }
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      return;
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
    <div className="relative space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        {selectedExisting.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex h-7 items-center gap-1.5 rounded-md bg-muted px-2 text-[13px] text-foreground"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeExisting(tag.id)}
              className="rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label={`Remove ${tag.name}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {newNames.map((name) => (
          <span
            key={`new-${name}`}
            className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary/10 px-2 text-[13px] text-primary"
          >
            {name}
            <button
              type="button"
              onClick={() => removeNew(name)}
              className="rounded p-0.5 text-primary/70 hover:text-primary"
              aria-label={`Remove ${name}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // Delay so mousedown on a suggestion still registers
            setTimeout(() => setOpen(false), 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            selectedExisting.length + newNames.length === 0
              ? "Add a tag…"
              : "Add another…"
          }
          className="min-w-[7rem] flex-1 bg-transparent py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground/40"
        />
      </div>

      {showMenu && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute left-0 z-20 mt-1 max-h-48 w-full min-w-[12rem] overflow-y-auto rounded-md border border-border bg-popover py-1 shadow-md"
        >
          {items.map((item, index) => {
            const isActive = index === highlightIndex;
            if (item.kind === "existing") {
              return (
                <li key={item.tag.id} data-index={index} role="option">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setHighlightIndex(index)}
                    onClick={() => addExisting(item.tag)}
                    className={cn(
                      "flex w-full items-center px-2.5 py-1.5 text-left text-sm",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {item.tag.name}
                  </button>
                </li>
              );
            }

            return (
              <li key={`create-${item.name}`} data-index={index} role="option">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onClick={() => addNew(item.name)}
                  className={cn(
                    "flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  Create “{item.name}”
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
