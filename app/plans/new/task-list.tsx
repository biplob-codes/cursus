"use client";

import { X } from "lucide-react";
import { Badge } from "@/ui/badge";
import { TaskInput } from "@/schema/task";

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

export function TaskList({
  tasks,
  onRemove,
}: {
  tasks: TaskInput[];
  onRemove: (index: number) => void;
}) {
  if (tasks.length === 0) return null;

  return (
    <ul className="space-y-0.5">
      {tasks.map((task, index) => (
        <li
          key={index}
          className="flex items-start justify-between gap-3 rounded px-2 py-1.5 hover:bg-muted/60"
        >
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm font-medium text-foreground">
              {task.title}
            </p>
            {task.description && (
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {task.description}
              </p>
            )}
            <div className="flex gap-1.5">
              <Badge
                variant="secondary"
                className={`text-[11px] ${statusClass[task.status]}`}
              >
                {statusLabel[task.status]}
              </Badge>
              <Badge
                variant="secondary"
                className={`text-[11px] ${priorityClass[task.priority]}`}
              >
                {priorityLabel[task.priority]}
              </Badge>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="mt-1 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove task</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
