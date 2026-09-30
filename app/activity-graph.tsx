import { format, parseISO, getDay } from "date-fns";
import { cn } from "cn";
import { LEVEL_LABEL } from "@/lib/activity";
import type { DayActivity, ActivityLevel } from "@/lib/activity";

const LEVEL_CLASS: Record<ActivityLevel, string> = {
  0: "bg-muted ring-1 ring-inset ring-border",
  1: "bg-red-500",
  2: "bg-violet-500",
  3: "bg-indigo-400",
  4: "bg-green-500",
};

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const LEVELS: ActivityLevel[] = [0, 1, 2, 3, 4];

function dayTitle(day: DayActivity): string {
  const date = format(parseISO(day.date), "MMM d, yyyy");
  if (day.level === 0) return `${date}: No plan`;
  return `${date}: ${day.done}/${day.total} tasks done (${day.percent}%)`;
}

type ActivityGraphProps = {
  data: DayActivity[];
  className?: string;
};

export function ActivityGraph({ data, className }: ActivityGraphProps) {
  if (data.length === 0) return null;

  const totalDone = data.reduce((sum, d) => sum + d.done, 0);

  // Each day gets an explicit grid position: column = week, row = weekday (Sun = 0)
  const firstWeekday = getDay(parseISO(data[0].date));
  const weekCount = Math.ceil((firstWeekday + data.length) / 7);

  const positioned = data.map((day, i) => {
    const offset = firstWeekday + i;
    return {
      day,
      col: Math.floor(offset / 7) + 2, // +1 for 1-based, +1 for label column
      row: (offset % 7) + 2, // +1 for 1-based, +1 for month label row
    };
  });

  // Month labels: one per month, placed at the column where the month first appears
  const rawLabels: { col: number; label: string }[] = [];
  let lastMonth = "";
  for (const { day, col } of positioned) {
    const month = format(parseISO(day.date), "MMM");
    if (month !== lastMonth) {
      rawLabels.push({ col, label: month });
      lastMonth = month;
    }
  }

  const monthLabels = rawLabels.filter(
    (m, i) => i === rawLabels.length - 1 || rawLabels[i + 1].col - m.col >= 3,
  );

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-foreground my-2">
        <span className="font-semibold">{totalDone}</span>{" "}
        {totalDone === 1 ? "task" : "tasks"} completed in the last {data.length}{" "}
        days
      </p>

      <div className="space-y-3 rounded-lg border border-border p-4">
        <div className="overflow-x-auto">
          <div
            className="grid gap-0.75"
            style={{
              gridTemplateColumns: `auto repeat(${weekCount}, minmax(0, 1fr))`,
              minWidth: `${weekCount * 13 + 32}px`,
            }}
          >
            {/* Month labels (row 1) */}
            {monthLabels.map(({ col, label }) => (
              <div
                key={`${label}-${col}`}
                className="whitespace-nowrap pb-1 text-xs leading-none text-foreground"
                style={{ gridColumn: col, gridRow: 1 }}
              >
                {label}
              </div>
            ))}

            {/* Weekday labels (column 1) */}
            {WEEKDAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="flex items-center pr-2 text-xs leading-none text-foreground"
                style={{ gridColumn: 1, gridRow: i + 2 }}
              >
                {label}
              </div>
            ))}

            {/* Day cells */}
            {positioned.map(({ day, col, row }) => (
              <div
                key={day.date}
                title={dayTitle(day)}
                className={cn(
                  "aspect-square w-full rounded-[3px]",
                  LEVEL_CLASS[day.level],
                )}
                style={{ gridColumn: col, gridRow: row }}
              />
            ))}
          </div>
        </div>

        {/* Legend, under the grid */}
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
          {LEVELS.map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <div
                className={cn("size-[11px] rounded-[3px]", LEVEL_CLASS[level])}
              />
              <span>{LEVEL_LABEL[level]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
