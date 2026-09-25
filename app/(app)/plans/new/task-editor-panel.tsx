"use client";

import { X } from "lucide-react";
import { TaskInput } from "@/schema/task";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

type Draft = {
  title: string;
  description: string;
  status: TaskInput["status"];
  priority: TaskInput["priority"];
};

type FieldErrors = Partial<Record<"title" | "description", string>>;

export function TaskEditorPanel({
  draft,
  errors,
  onChange,
  onSave,
  onCancel,
}: {
  draft: Draft;
  errors: FieldErrors;
  onChange: (patch: Partial<Draft>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <aside className="flex h-full min-h-screen w-1/2 flex-col border-l border-border bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-medium text-muted-foreground">
          New task
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pb-8">
        {/* Title — borderless, Notion-style */}
        <div>
          <input
            autoFocus
            type="text"
            placeholder="Untitled"
            value={draft.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full bg-transparent text-2xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/50"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-destructive">{errors.title}</p>
          )}
        </div>

        {/* Status + Priority — borderless triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={draft.status}
            onValueChange={(value) =>
              onChange({ status: value as TaskInput["status"] })
            }
          >
            <SelectTrigger className="h-8 w-auto gap-1.5 border-0 bg-muted/60 px-2.5 shadow-none hover:bg-muted focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">To-do</SelectItem>
              <SelectItem value="IN_PROGRESS">In progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={draft.priority}
            onValueChange={(value) =>
              onChange({ priority: value as TaskInput["priority"] })
            }
          >
            <SelectTrigger className="h-8 w-auto gap-1.5 border-0 bg-muted/60 px-2.5 shadow-none hover:bg-muted focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description — plain for now; rich editor in a later step */}
        <div className="flex-1">
          <textarea
            rows={12}
            placeholder="Add a description…"
            value={draft.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-destructive">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border px-6 py-4">
        <Button type="button" size="sm" onClick={onSave}>
          Add task
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </aside>
  );
}
