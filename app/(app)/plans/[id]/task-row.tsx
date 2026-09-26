"use client";

import { useState, useTransition } from "react";
import { Task } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { TaskCheckbox } from "./task-checkbox";
import { TaskDescription } from "./task-description";
import { toggleTaskDone } from "@/actions/task";

const priorityLabel: Record<Task["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const priorityClass: Record<Task["priority"], string> = {
  LOW: "text-muted-foreground",
  MEDIUM: "text-amber-700 dark:text-amber-400",
  HIGH: "text-red-700 dark:text-red-400",
};

export function TaskRow({ task }: { task: Task }) {
  const [expanded, setExpanded] = useState(false);
  const [done, setDone] = useState(task.status === "DONE");
  const [, startTransition] = useTransition();

  function handleToggleDone(next: boolean) {
    setDone(next);
    setExpanded(false);
    startTransition(async () => {
      try {
        await toggleTaskDone(task.id, next);
      } catch {
        setDone(!next);
      }
    });
  }

  function handleRowClick() {
    if (!task.description) return;
    setExpanded((prev) => !prev);
  }

  return (
    <li
      className={cn(
        "rounded-md px-2 py-2 transition-colors",
        expanded ? "bg-muted/40" : "hover:bg-muted/40",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="shrink-0"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <TaskCheckbox
            taskId={task.id}
            done={done}
            onCheckedChange={handleToggleDone}
          />
        </div>

        <button
          type="button"
          onClick={handleRowClick}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 text-left",
            task.description ? "cursor-pointer" : "cursor-default",
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm",
              done ? "text-muted-foreground/70" : "font-medium text-foreground",
            )}
          >
            {task.title}
          </span>
          <span
            className={cn(
              "shrink-0  px-2 py-0.5 text-sm",
              priorityClass[task.priority],
            )}
          >
            {priorityLabel[task.priority]}
          </span>
        </button>
      </div>

      {expanded && task.description ? (
        <div className="mt-2 pl-7">
          <TaskDescription html={task.description} muted={done} />
        </div>
      ) : null}
    </li>
  );
}
