"use client";

import { useActionState, useEffect, useState } from "react";
import { addDays } from "date-fns";
import { PlanHeader } from "./plan-header";
import { NoteField } from "./note-field";
import { AddTaskPanel } from "./add-task-panel";
import { TaskList } from "./task-list";
import { TaskEditorPanel } from "./task-editor-panel";
import { TaskInput, taskInputSchema } from "@/schema/task";
import { createPlanWithTasks } from "@/actions/plan";
import { initialActionState } from "@/actions/action-state";
import { Button } from "@/ui/button";
import { useAppChrome } from "@/app/app-chrome-context";
import { cn } from "@/lib/utils";

const emptyDraft = {
  title: "",
  description: "",
  status: "TODO" as TaskInput["status"],
  priority: "MEDIUM" as TaskInput["priority"],
};

type FieldErrors = Partial<Record<"title" | "description", string>>;

export function CreatePlanView() {
  const { taskPanelOpen, openTaskPanel, closeTaskPanel } = useAppChrome();
  const [date, setDate] = useState<Date>(() => addDays(new Date(), 1));
  const [note, setNote] = useState("");
  const [tasks, setTasks] = useState<TaskInput[]>([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, formAction, isPending] = useActionState(
    createPlanWithTasks,
    initialActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      setDate(addDays(new Date(), 1));
      setNote("");
      setTasks([]);
      setDraft(emptyDraft);
      setErrors({});
      closeTaskPanel();
    }
  }, [state, closeTaskPanel]);

  function handleOpenPanel() {
    // Starting a new draft (or re-focusing the current one)
    if (!taskPanelOpen) {
      setDraft(emptyDraft);
      setErrors({});
    }
    openTaskPanel();
  }

  function handleCancelPanel() {
    setDraft(emptyDraft);
    setErrors({});
    closeTaskPanel();
  }

  function handleSaveTask() {
    const parsed = taskInputSchema.safeParse(draft);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({ title: flat.title?.[0], description: flat.description?.[0] });
      return;
    }
    setTasks((prev) => [...prev, parsed.data]);
    setDraft(emptyDraft);
    setErrors({});
    closeTaskPanel();
  }

  return (
    <div
      className={cn(
        "flex w-full",
        taskPanelOpen ? "min-h-screen" : "mx-auto max-w-2xl",
      )}
    >
      {/* Left: plan form (half width when panel is open) */}
      <div
        className={cn(
          taskPanelOpen
            ? "w-1/2 overflow-y-auto px-10 py-12"
            : "w-full space-y-6",
        )}
      >
        <form action={formAction} className="space-y-6">
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
            <AddTaskPanel
              isOpen={taskPanelOpen}
              draft={taskPanelOpen ? draft : null}
              onOpen={handleOpenPanel}
            />
            {state.errors?.tasks && (
              <p className="text-xs text-destructive">
                {state.errors.tasks[0]}
              </p>
            )}
          </div>

          <input type="hidden" name="tasksJson" value={JSON.stringify(tasks)} />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Create plan"}
            </Button>
            {state.status === "error" && !state.errors && (
              <p className="text-xs text-destructive">{state.message}</p>
            )}
            {state.status === "success" && (
              <p className="text-xs text-muted-foreground">{state.message}</p>
            )}
          </div>
        </form>
      </div>

      {/* Right: task editor panel */}
      {taskPanelOpen && (
        <TaskEditorPanel
          draft={draft}
          errors={errors}
          onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
          onSave={handleSaveTask}
          onCancel={handleCancelPanel}
        />
      )}
    </div>
  );
}
