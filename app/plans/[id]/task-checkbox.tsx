"use client";

import { useState, useTransition } from "react";
import { Checkbox } from "@/ui/checkbox";
import { toggleTaskDone } from "@/actions/task";

export function TaskCheckbox({
  taskId,
  done,
}: {
  taskId: string;
  done: boolean;
}) {
  const [checked, setChecked] = useState(done);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: boolean) {
    setChecked(next); // optimistic — flips instantly, no spinner wait
    startTransition(async () => {
      try {
        await toggleTaskDone(taskId, next);
      } catch {
        setChecked(!next); // revert if the write failed
      }
    });
  }

  return (
    <Checkbox
      checked={checked}
      disabled={isPending}
      onCheckedChange={(value) => handleChange(value === true)}
      className="mt-0.5"
    />
  );
}
