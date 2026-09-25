"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { TaskInput, taskInputSchema } from "@/schema/task";

type FieldErrors = Partial<Record<"title" | "description", string>>;

const emptyDraft = {
  title: "",
  description: "",
  status: "TODO" as TaskInput["status"],
  priority: "MEDIUM" as TaskInput["priority"],
};

export function AddTaskPanel({ onAdd }: { onAdd: (task: TaskInput) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [errors, setErrors] = useState<FieldErrors>({});

  function close() {
    setDraft(emptyDraft);
    setErrors({});
    setIsOpen(false);
  }

  function handleAdd() {
    // Client-side validation for instant feedback — the server re-validates
    // this same shape (taskInputSchema) when the whole plan is submitted.
    const parsed = taskInputSchema.safeParse(draft);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({ title: flat.title?.[0], description: flat.description?.[0] });
      return;
    }
    onAdd(parsed.data);
    close();
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full"
      >
        <Plus className="h-4 w-4" />
        Add task
      </button>
    );
  }

  return (
    <div className="space-y-3  p-3">
      <div className="space-y-1">
        <Input
          autoFocus
          placeholder="Task title"
          value={draft.title}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, title: event.target.value }))
          }
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-1">
        <Textarea
          rows={2}
          placeholder="Add a description…"
          value={draft.description}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, description: event.target.value }))
          }
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={draft.status}
          onValueChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              status: value as TaskInput["status"],
            }))
          }
        >
          <SelectTrigger className="h-8 w-[150px]">
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
            setDraft((prev) => ({
              ...prev,
              priority: value as TaskInput["priority"],
            }))
          }
        >
          <SelectTrigger className="h-8 w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button type="button" size="sm" onClick={handleAdd}>
          Add task
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
