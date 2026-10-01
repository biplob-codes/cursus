import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import type { Plan, Task } from "@/generated/prisma/client";
import { formatDateOnly, getRelativeDayLabel } from "@/lib/date";
import { planProgress } from "@/lib/plan";
import { cn } from "@/lib/utils";
import { Calendar, ListChecks, ListTodo, Clock, RefreshCw } from "lucide-react";

function formatPlanDate(date: Date) {
  const absolute = formatDateOnly(date, "d MMM yyyy");
  const relative = getRelativeDayLabel(date);
  const relativeLabel = relative.charAt(0).toUpperCase() + relative.slice(1);
  return `${absolute} (${relativeLabel})`;
}

export function PlansTable({ plans }: { plans: (Plan & { tasks: Task[] })[] }) {
  if (plans.length === 0) {
    return (
      <p className="px-2 py-4 text-sm text-muted-foreground">No plans yet.</p>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-2 py-2 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.8} />
                Date
              </span>
            </th>
            <th className="px-2 py-2 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ListChecks className="h-3.5 w-3.5" strokeWidth={1.8} />
                Progress
              </span>
            </th>
            <th className="px-2 py-2 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ListTodo className="h-3.5 w-3.5" strokeWidth={1.8} />
                Tasks
              </span>
            </th>
            <th className="px-2 py-2 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
                Created
              </span>
            </th>
            <th className="px-2 py-2 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.8} />
                Updated
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => {
            const { total, done, progress } = planProgress(plan.tasks);
            return (
              <tr
                key={plan.id}
                className="border-b border-border/70 hover:bg-muted/50"
              >
                <td className="px-2 py-2">
                  <Link
                    href={`/plans/${plan.id}`}
                    className="block min-w-0 font-medium text-foreground hover:underline"
                  >
                    {formatPlanDate(plan.date)}
                  </Link>
                </td>
                <td className="px-2 py-2">
                  {total === 0 ? (
                    <span className="text-muted-foreground/50">—</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            progress === 100 ? "bg-green-500" : "bg-primary",
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {done}/{total}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-2 py-2 tabular-nums text-muted-foreground">
                  {total === 0 ? (
                    <span className="text-muted-foreground/50">—</span>
                  ) : (
                    total
                  )}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-muted-foreground">
                  {formatDistanceToNowStrict(plan.createdAt, {
                    addSuffix: true,
                  })}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-muted-foreground">
                  {formatDistanceToNowStrict(plan.updatedAt, {
                    addSuffix: true,
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
