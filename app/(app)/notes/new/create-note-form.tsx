"use client";

import { useActionState, useState } from "react";
import { createNote } from "@/actions/note";
import { initialActionState } from "@/actions/action-state";
import { Button } from "@/ui/button";

import { NoteTagPicker, type TagOption } from "@/components/note-tag-picker";
import { RichTextEditor } from "@/components/rich-text-editor";

export function CreateNoteForm({
  existingTags,
}: {
  existingTags: TagOption[];
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newNames, setNewNames] = useState<string[]>([]);
  const [state, formAction, isPending] = useActionState(
    createNote,
    initialActionState,
  );

  return (
    <form action={formAction} className="mx-auto w-full max-w-2xl space-y-6">
      {/* Title — large, no chrome */}
      <div className="space-y-1">
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          autoFocus
          className="w-full bg-transparent text-3xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/35"
        />
        {state.errors?.title && (
          <p className="text-xs text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Tags — inline, Notion-style */}
      <div className="space-y-1">
        <NoteTagPicker
          existingTags={existingTags}
          selectedIds={selectedIds}
          newNames={newNames}
          onSelectedIdsChange={setSelectedIds}
          onNewNamesChange={setNewNames}
        />
        {state.errors?.tagIds && (
          <p className="text-xs text-destructive">{state.errors.tagIds[0]}</p>
        )}
        {state.errors?.newTagNames && (
          <p className="text-xs text-destructive">
            {state.errors.newTagNames[0]}
          </p>
        )}
      </div>

      {/* Description — no border, same editor */}
      <div className="space-y-1">
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Start writing…"
        />
        {state.errors?.description && (
          <p className="text-xs text-destructive">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="tagIds" value={JSON.stringify(selectedIds)} />
      <input
        type="hidden"
        name="newTagNames"
        value={JSON.stringify(newNames)}
      />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isPending || !title.trim()}>
          {isPending ? "Creating…" : "Create note"}
        </Button>
        {state.status === "error" && !state.errors && (
          <p className="text-xs text-destructive">{state.message}</p>
        )}
      </div>
    </form>
  );
}
