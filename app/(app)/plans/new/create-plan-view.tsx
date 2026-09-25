"use client";

import { useActionState, useEffect, useState } from "react";
import { addDays } from "date-fns";
import { PlanHeader } from "./plan-header";
import { NoteField } from "./note-field";
import { AddTaskPanel } from "./add-task-panel";
import { TaskList } from "./task-list";
import { TaskInput } from "@/schema/task";
import { createPlanWithTasks } from "@/actions/plan";
import { initialActionState } from "@/actions/action-state";
import { Button } from "@/ui/button";

export function CreatePlanView() {
  const [date, setDate] = useState<Date>(() => addDays(new Date(), 1));
  const [note, setNote] = useState("");
  const [tasks, setTasks] = useState<TaskInput[]>([]);
  const [state, formAction, isPending] = useActionState(
    createPlanWithTasks,
    initialActionState,
  );
  useEffect(() => {
    if (state.status === "success") {
      setDate(addDays(new Date(), 1));
      setNote("");
      setTasks([]);
    }
  }, [state]);

  return (
    <form action={formAction} className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-1.5">
        <PlanHeader date={date} onDateChange={setDate} />
        {state.errors?.date && (
          <p className="text-xs text-destructive">{state.errors.date[0]}</p>
        )}
      </div>
      <input type="hidden" name="date" value={date.toISOString()} />

      <div className="space-y-1.5">
        <NoteField value={note} onChange={setNote} />
        {state.errors?.note && (
          <p className="text-xs text-destructive">{state.errors.note[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">Tasks</h2>
        <TaskList
          tasks={tasks}
          onRemove={(index) =>
            setTasks((prev) => prev.filter((_, i) => i !== index))
          }
        />
        <AddTaskPanel onAdd={(task) => setTasks((prev) => [...prev, task])} />
        {state.errors?.tasks && (
          <p className="text-xs text-destructive">{state.errors.tasks[0]}</p>
        )}
      </div>
      {/* Tasks are built up client-side and shipped as JSON; the server
          parses and re-validates this same shape before writing anything. */}
      <input type="hidden" name="tasksJson" value={JSON.stringify(tasks)} />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating…" : "Create plan"}
        </Button>
        {state.status === "error" && !state.errors && (
          <p className="text-xs text-destructive">{state.message}</p>
        )}
      </div>
    </form>
  );
}
