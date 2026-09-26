"use client";

import { Checkbox } from "@/ui/checkbox";

export function TaskCheckbox({
  taskId,
  done,
  onCheckedChange,
}: {
  taskId: string;
  done: boolean;
  onCheckedChange?: (next: boolean) => void;
}) {
  return (
    <Checkbox
      checked={done}
      onCheckedChange={(value) => onCheckedChange?.(value === true)}
      aria-label={done ? "Mark incomplete" : "Mark complete"}
      className="mt-0.5"
    />
  );
}
