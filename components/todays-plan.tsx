// components/todays-plan.tsx
import Link from "next/link";
import { format } from "date-fns";
import type { Plan, Task } from "@/generated/prisma/client";
import { formatDateOnly } from "@/lib/date";

type PlanWithTasks = Plan & { tasks: Task[] };

function planProgress(tasks: Task[]) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, progress };
}

export function TodaysPlan({ plan }: { plan: Plan & { tasks: Task[] } }) {
  const { total, done, progress } = planProgress(plan.tasks);

  return (
    <Link
      href={`/plans/${plan.id}`}
      className="flex items-start justify-between gap-4 rounded px-2 py-2.5 hover:bg-muted/60"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {formatDateOnly(plan.date)}
        </p>
        {plan.note ? (
          <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
            {plan.note}
          </p>
        ) : null}
      </div>
      {total > 0 && (
        <span className="shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground">
          {done}/{total}
          <span className="ml-1 text-muted-foreground/70">({progress}%)</span>
        </span>
      )}
    </Link>
  );
}

export function TodaysPlansSection({ plans }: { plans: PlanWithTasks[] }) {
  return (
    <section className="space-y-1">
      <h2 className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Today
      </h2>
      {plans.length === 0 ? (
        <p className="px-2 py-2 text-sm text-muted-foreground">
          No plan for today.{" "}
          <Link
            href="/plans/new"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      ) : (
        <div className="space-y-0.5">
          {plans.map((plan) => (
            <TodaysPlan key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </section>
  );
}
