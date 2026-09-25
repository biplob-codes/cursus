"use client";

import { X } from "lucide-react";
import { TaskInput } from "@/schema/task";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/ui/select";
import { TaskDescriptionEditor } from "./task-description-editor";
import { cn } from "@/lib/utils";

type Draft = {
  title: string;
  description: string;
  status: TaskInput["status"];
  priority: TaskInput["priority"];
};

type FieldErrors = Partial<Record<"title" | "description", string>>;

const statusOptions = [
  {
    value: "TODO" as const,
    label: "To-do",
    className: "text-muted-foreground",
  },
  {
    value: "IN_PROGRESS" as const,
    label: "In progress",
    className: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "DONE" as const,
    label: "Done",
    className: "text-green-600 dark:text-green-400",
  },
] as const;

const priorityOptions = [
  {
    value: "LOW" as const,
    label: "Low",
    className: "text-muted-foreground",
  },
  {
    value: "MEDIUM" as const,
    label: "Medium",
    className: "text-amber-600 dark:text-amber-400",
  },
  {
    value: "HIGH" as const,
    label: "High",
    className: "text-red-600 dark:text-red-400",
  },
] as const;

const propertyTriggerClass = cn(
  "h-auto w-auto gap-1.5 rounded-md border-0 bg-transparent px-2 py-1 text-sm shadow-none",
  "hover:bg-muted focus:bg-muted focus-visible:ring-0 focus-visible:border-transparent",
  "data-[popup-open]:bg-muted dark:bg-transparent dark:hover:bg-muted dark:focus:bg-muted",
  "[&_svg:last-child]:hidden",
);

export function TaskEditorPanel({
  draft,
  errors,
  onChange,
  onClose,
}: {
  draft: Draft;
  errors: FieldErrors;
  onChange: (patch: Partial<Draft>) => void;
  onClose: () => void;
}) {
  const activeStatus =
    statusOptions.find((o) => o.value === draft.status) ?? statusOptions[0];
  const activePriority =
    priorityOptions.find((o) => o.value === draft.priority) ??
    priorityOptions[1];

  return (
    <aside className="flex h-full min-h-screen w-1/2 flex-col border-l border-border bg-muted/40">
      <div className="flex items-center justify-end px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pb-10">
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

        <div className="flex flex-wrap items-center gap-1">
          <Select
            value={draft.status}
            onValueChange={(value) =>
              onChange({ status: value as TaskInput["status"] })
            }
          >
            <SelectTrigger className={propertyTriggerClass}>
              <span className={cn("text-sm", activeStatus.className)}>
                {activeStatus.label}
              </span>
            </SelectTrigger>

            <SelectContent align="start" className="min-w-[180px] p-1">
              {statusOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={cn("px-2 py-1.5", option.className)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={draft.priority}
            onValueChange={(value) =>
              onChange({ priority: value as TaskInput["priority"] })
            }
          >
            <SelectTrigger className={propertyTriggerClass}>
              <span className={cn("text-sm", activePriority.className)}>
                {activePriority.label}
              </span>
            </SelectTrigger>

            <SelectContent align="start" className="min-w-[160px] p-1">
              {priorityOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={cn("px-2 py-1.5", option.className)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <TaskDescriptionEditor
            value={draft.description}
            onChange={(html) => onChange({ description: html })}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-destructive">
              {errors.description}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
