import Link from "next/link";
import { format } from "date-fns";
import { Plan, Task } from "@/generated/prisma/client";
import { getRelativeDayLabel } from "@/lib/date";

export function PlanListItem({ plan }: { plan: Plan & { tasks: Task[] } }) {
  const total = plan.tasks.length;
  const done = plan.tasks.filter((task) => task.status === "DONE").length;

  return (
    <Link
      href={`/plans/${plan.id}`}
      className="flex items-center justify-between gap-4 rounded px-2 py-2.5 hover:bg-muted/60"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">
          {getRelativeDayLabel(plan.date)}{" "}
          <span className="font-normal text-muted-foreground">
            ({format(plan.date, "d MMMM yyyy")})
          </span>
        </p>
        {plan.note && (
          <p className="truncate text-xs text-muted-foreground">{plan.note}</p>
        )}
      </div>
      {total > 0 && (
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {done}/{total} done
        </span>
      )}
    </Link>
  );
}
