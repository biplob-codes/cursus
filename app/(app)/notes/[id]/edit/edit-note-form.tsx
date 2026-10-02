"use client";

import { initialActionState } from "@/actions/action-state";
import { updateNote } from "@/actions/note";
import { NoteTagPicker, type TagOption } from "@/components/note-tag-picker";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

type NoteData = {
  id: string;
  title: string;
  description: string;
  tagIds: string[];
};

export function EditNoteForm({
  note,
  existingTags,
}: {
  note: NoteData;
  existingTags: TagOption[];
}) {
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [selectedIds, setSelectedIds] = useState<string[]>(note.tagIds);
  const [newNames, setNewNames] = useState<string[]>([]);
  const [state, formAction, isPending] = useActionState(
    updateNote,
    initialActionState,
  );

  return (
    <form action={formAction} className="mx-auto w-full max-w-4xl space-y-6">
      <Link
        href={`/notes/${note.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
        Back to note
      </Link>

      <div className="space-y-1">
        <textarea
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            const el = e.target;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          ref={(el) => {
            if (el) {
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }
          }}
          placeholder="Untitled"
          rows={1}
          autoFocus
          className="w-full resize-none overflow-hidden bg-transparent text-3xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/35"
        />
        {state.errors?.title && (
          <p className="text-xs text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

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

      <input type="hidden" name="id" value={note.id} />
      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="tagIds" value={JSON.stringify(selectedIds)} />
      <input
        type="hidden"
        name="newTagNames"
        value={JSON.stringify(newNames)}
      />

      <div className="flex items-center gap-3 pt-2 justify-end">
        <Link
          href={`/notes/${note.id}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link>{" "}
        <Button type="submit" disabled={isPending || !title.trim()}>
          {isPending ? "Saving…" : "Save"}
        </Button>
        {state.status === "error" && !state.errors && (
          <p className="text-xs text-destructive">{state.message}</p>
        )}
      </div>
    </form>
  );
}
