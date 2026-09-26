import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { headers } from "next/headers";
import { Task } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getRelativeDayLabel } from "@/lib/date";
import { TaskRow } from "./task-row";

const priorityRank: Record<Task["priority"], number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/signin");

  const { id } = await params;

  const plan = await prisma.plan.findFirst({
    where: { id, userId: session.user.id },
    include: { tasks: true },
  });

  if (!plan) notFound();

  const tasks = [...plan.tasks].sort((a, b) => {
    const aDone = a.status === "DONE" ? 1 : 0;
    const bDone = b.status === "DONE" ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;
    return priorityRank[a.priority] - priorityRank[b.priority];
  });

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.status === "DONE").length;
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  const relative = getRelativeDayLabel(plan.date);
  const relativeLabel = relative.charAt(0).toUpperCase() + relative.slice(1);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {format(plan.date, "d MMMM yyyy")}
            <span className="ml-2 font-normal text-muted-foreground">
              ({relativeLabel})
            </span>
          </h1>

          {total > 0 && (
            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
              {doneCount}/{total}
              <span className="ml-1 text-muted-foreground/70">
                ({progress}%)
              </span>
            </span>
          )}
        </div>

        {plan.note ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {plan.note}
          </p>
        ) : null}
      </div>

      <div className="space-y-1">
        {tasks.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            No tasks for this plan yet.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
