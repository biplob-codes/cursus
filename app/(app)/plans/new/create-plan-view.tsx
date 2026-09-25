"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
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

function tryParseDraft(draft: typeof emptyDraft): TaskInput | null {
  const parsed = taskInputSchema.safeParse(draft);
  return parsed.success ? parsed.data : null;
}

function taskToDraft(task: TaskInput): typeof emptyDraft {
  return {
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    priority: task.priority,
  };
}

export function CreatePlanView() {
  const { taskPanelOpen, openTaskPanel, closeTaskPanel } = useAppChrome();
  const [date, setDate] = useState<Date>(() => addDays(new Date(), 1));
  const [note, setNote] = useState("");
  const [tasks, setTasks] = useState<TaskInput[]>([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [errors, setErrors] = useState<FieldErrors>({});
  /** null = composing a new task; number = editing tasks[index] */
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editorKey, setEditorKey] = useState(0);
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
      setEditingIndex(null);
      setEditorKey((k) => k + 1);
      closeTaskPanel();
    }
  }, [state, closeTaskPanel]);

  // List rows reflect the draft live while editing an existing task
  const displayTasks = useMemo(() => {
    if (!taskPanelOpen || editingIndex === null) return tasks;
    return tasks.map((task, index) =>
      index === editingIndex
        ? {
            ...task,
            title: draft.title,
            description: draft.description || undefined,
            status: draft.status,
            priority: draft.priority,
          }
        : task,
    );
  }, [tasks, draft, taskPanelOpen, editingIndex]);

  const tasksForSubmit = useMemo(() => {
    if (!taskPanelOpen) return tasks;
    const parsed = tryParseDraft(draft);
    if (!parsed) return tasks;
    if (editingIndex !== null) {
      return tasks.map((t, i) => (i === editingIndex ? parsed : t));
    }
    return [...tasks, parsed];
  }, [tasks, draft, taskPanelOpen, editingIndex]);

  function commitDraftIfValid() {
    const parsed = tryParseDraft(draft);
    if (!parsed) return;

    if (editingIndex !== null) {
      setTasks((prev) => prev.map((t, i) => (i === editingIndex ? parsed : t)));
    } else {
      setTasks((prev) => [...prev, parsed]);
    }
  }

  function startFreshDraft() {
    setDraft(emptyDraft);
    setErrors({});
    setEditingIndex(null);
    setEditorKey((k) => k + 1);
  }

  function handleOpenPanel() {
    if (taskPanelOpen) {
      commitDraftIfValid();
      startFreshDraft();
      return;
    }
    startFreshDraft();
    openTaskPanel();
  }

  function handleSelectTask(index: number) {
    if (taskPanelOpen) {
      commitDraftIfValid();
    }
    // After commit, index is still correct for the same item
    const task =
      editingIndex !== null && tryParseDraft(draft) && index === editingIndex
        ? tryParseDraft(draft)!
        : tasks[index];
    // Prefer latest committed state
    const source = tasks[index];
    if (!source && !task) return;

    // Re-read from tasks after a sync commit is async; use draft overlay if same index
    const next =
      taskPanelOpen && editingIndex === index
        ? (tryParseDraft(draft) ?? source)
        : source;

    if (!next) return;

    setDraft(taskToDraft(next));
    setErrors({});
    setEditingIndex(index);
    setEditorKey((k) => k + 1);
    openTaskPanel();
  }

  function handleClosePanel() {
    commitDraftIfValid();
    startFreshDraft();
    closeTaskPanel();
  }

  return (
    <div
      className={cn(
        "flex w-full",
        taskPanelOpen ? "min-h-screen" : "mx-auto max-w-2xl",
      )}
    >
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
              tasks={displayTasks}
              selectedIndex={taskPanelOpen ? editingIndex : null}
              onSelect={handleSelectTask}
            />
            <AddTaskPanel
              isOpen={taskPanelOpen}
              isEditingExisting={editingIndex !== null}
              draft={taskPanelOpen ? draft : null}
              onOpen={handleOpenPanel}
            />
            {state.errors?.tasks && (
              <p className="text-xs text-destructive">
                {state.errors.tasks[0]}
              </p>
            )}
          </div>

          <input
            type="hidden"
            name="tasksJson"
            value={JSON.stringify(tasksForSubmit)}
          />

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

      {taskPanelOpen && (
        <TaskEditorPanel
          key={editorKey}
          draft={draft}
          errors={errors}
          onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
}
