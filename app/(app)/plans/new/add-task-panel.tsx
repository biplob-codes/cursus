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

const priorityLabel: Record<TaskInput["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const priorityClass: Record<TaskInput["priority"], string> = {
  LOW: "bg-muted text-muted-foreground",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  HIGH: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function AddTaskPanel({
  isOpen,
  isEditingExisting,
  draft,
  onOpen,
}: {
  isOpen: boolean;
  isEditingExisting: boolean;
  draft: Draft | null;
  onOpen: () => void;
}) {
  const showDraftPreview = isOpen && draft && !isEditingExisting;

  return (
    <div className="space-y-1">
      {showDraftPreview && (
        <div className="flex items-center gap-2 rounded px-2 py-1.5 bg-muted/40">
          <p className="min-w-0 flex-1 truncate font-medium text-foreground">
            {draft.title.trim() || (
              <span className="text-muted-foreground">Untitled</span>
            )}
          </p>
          <Badge
            variant="secondary"
            className={`shrink-0 text-[11px] ${priorityClass[draft.priority]}`}
          >
            {priorityLabel[draft.priority]}
          </Badge>
        </div>
      )}

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
