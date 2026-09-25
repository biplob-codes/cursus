"use client";

import { Plus } from "lucide-react";
import { Badge } from "@/ui/badge";
import { TaskInput } from "@/schema/task";

type Draft = {
  title: string;
  description: string;
  status: TaskInput["status"];
  priority: TaskInput["priority"];
};

const statusLabel: Record<TaskInput["status"], string> = {
  TODO: "To-do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

const priorityLabel: Record<TaskInput["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const statusClass: Record<TaskInput["status"], string> = {
  TODO: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  DONE: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
};

const priorityClass: Record<TaskInput["priority"], string> = {
  LOW: "bg-muted text-muted-foreground",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  HIGH: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function AddTaskPanel({
  isOpen,
  draft,
  onOpen,
}: {
  isOpen: boolean;
  draft: Draft | null;
  onOpen: () => void;
}) {
  return (
    <div className="space-y-1">
      {/* Live preview of the draft being edited in the right panel */}
      {isOpen && draft && (
        <div className="flex items-start justify-between gap-3 rounded px-2 py-1.5 bg-muted/40">
          <div className="min-w-0 space-y-1">
            <p className="truncate font-medium text-foreground">
              {draft.title.trim() || (
                <span className="text-muted-foreground">Untitled</span>
              )}
            </p>
            {draft.description.trim() ? (
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {draft.description}
              </p>
            ) : null}
            <div className="flex gap-1.5">
              <Badge
                variant="secondary"
                className={`text-[11px] ${statusClass[draft.status]}`}
              >
                {statusLabel[draft.status]}
              </Badge>
              <Badge
                variant="secondary"
                className={`text-[11px] ${priorityClass[draft.priority]}`}
              >
                {priorityLabel[draft.priority]}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Always show Add task; when panel is open this is the “another one under” */}
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        Add task
      </button>
    </div>
  );
}
