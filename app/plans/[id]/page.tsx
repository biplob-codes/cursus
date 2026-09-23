import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Task } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getRelativeDayLabel } from "@/lib/date";
import { Badge } from "@/ui/badge";
import { TaskCheckbox } from "./task-checkbox";

const priorityRank: Record<Task["priority"], number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

const statusLabel: Record<Task["status"], string> = {
  TODO: "To-do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

const priorityLabel: Record<Task["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const statusClass: Record<Task["status"], string> = {
  TODO: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  DONE: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
};

const priorityClass: Record<Task["priority"], string> = {
  LOW: "bg-muted text-muted-foreground",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  HIGH: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const plan = await prisma.plan.findUnique({
    where: { id },
    include: { tasks: true },
  });

  if (!plan) notFound();

  // Open tasks first (by priority), done tasks sink to the bottom.
  const tasks = [...plan.tasks].sort((a, b) => {
    const aDone = a.status === "DONE" ? 1 : 0;
    const bDone = b.status === "DONE" ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;
    return priorityRank[a.priority] - priorityRank[b.priority];
  });

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Plan for {getRelativeDayLabel(plan.date)}{" "}
          <span className="font-normal text-muted-foreground">
            ({format(plan.date, "d MMMM yyyy")})
          </span>
        </h1>
        {plan.note && (
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {plan.note}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">Tasks</h2>

        {tasks.length === 0 ? (
          <p className="px-2 text-sm text-muted-foreground">
            No tasks for this plan yet.
          </p>
        ) : (
          <div className="space-y-0.5">
            {tasks.map((task) => {
              const done = task.status === "DONE";
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded px-2 py-1.5 hover:bg-muted/60"
                >
                  <TaskCheckbox taskId={task.id} done={done} />
                  <div className="min-w-0 flex-1 space-y-1">
                    <p
                      className={
                        done
                          ? "truncate text-sm text-muted-foreground line-through"
                          : "truncate text-sm font-medium text-foreground"
                      }
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                    <div className="flex gap-1.5">
                      {!done && (
                        <Badge
                          variant="secondary"
                          className={`text-[11px] ${statusClass[task.status]}`}
                        >
                          {statusLabel[task.status]}
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={`text-[11px] ${priorityClass[task.priority]}`}
                      >
                        {priorityLabel[task.priority]}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
