import type { Task } from "@/generated/prisma/client";

export type PlanProgress = {
  total: number;
  done: number;
  progress: number;
};

/** Task completion stats for a plan (or any task list). */
export function planProgress(tasks: Pick<Task, "status">[]): PlanProgress {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, progress };
}
