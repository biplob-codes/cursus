"use client";

import { Badge } from "@/ui/badge";
import { TaskInput } from "@/schema/task";
import { cn } from "@/lib/utils";

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

export function TaskList({
  tasks,
  selectedIndex,
  onSelect,
}: {
  tasks: TaskInput[];
  selectedIndex?: number | null;
  onSelect?: (index: number) => void;
}) {
  if (tasks.length === 0) return null;

  return (
    <ul className="space-y-1">
      {tasks.map((task, index) => {
        const isSelected = selectedIndex === index;
        const title = task.title.trim();
        return (
          <li key={`${index}-${title || "untitled"}`}>
            <button
              type="button"
              onClick={() => onSelect?.(index)}
              className={cn(
                "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-colors",
                isSelected ? "bg-muted/60" : "hover:bg-muted/40",
              )}
            >
              <p className="min-w-0 flex-1 truncate font-medium text-foreground">
                {title || (
                  <span className="text-muted-foreground">Untitled</span>
                )}
              </p>
              <Badge
                variant="secondary"
                className={`shrink-0 text-[11px] ${priorityClass[task.priority]}`}
              >
                {priorityLabel[task.priority]}
              </Badge>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
