"use client";

import { useActionState, useState } from "react";
import { createNote } from "@/actions/note";
import { initialActionState } from "@/actions/action-state";
import { Button } from "@/ui/button";
import { TaskDescriptionEditor } from "@/app/(app)/plans/new/task-description-editor";
import { NoteTagPicker, type TagOption } from "./note-tag-picker";

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
    <form action={formAction} className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          New note
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write something down and tag it so you can find it later.
        </p>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          autoFocus
          className="w-full bg-transparent text-2xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40"
        />
        {state.errors?.title && (
          <p className="text-xs text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
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

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Description
        </label>
        <div className="rounded-lg border border-border px-3 py-2">
          <TaskDescriptionEditor
            value={description}
            onChange={setDescription}
            placeholder="Start writing…"
          />
        </div>
        {state.errors?.description && (
          <p className="text-xs text-destructive">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      {/* Hidden fields for the server action */}
      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="tagIds" value={JSON.stringify(selectedIds)} />
      <input
        type="hidden"
        name="newTagNames"
        value={JSON.stringify(newNames)}
      />

      <div className="flex items-center gap-3">
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
