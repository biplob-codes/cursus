// app/(app)/plans/activity-graph.tsx
import { format, parseISO, getDay } from "date-fns";
import { cn } from "cn";
import type { DayActivity, ActivityLevel } from "@/lib/activity";

const LEVEL_CLASS: Record<ActivityLevel, string> = {
  0: "bg-muted/80 ring-1 ring-inset ring-border/60",
  1: "bg-emerald-200 dark:bg-emerald-950",
  2: "bg-emerald-300 dark:bg-emerald-800",
  3: "bg-emerald-500 dark:bg-emerald-600",
  4: "bg-emerald-600 dark:bg-emerald-400",
};

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]; // sparse like GitHub

function levelLabel(day: DayActivity): string {
  if (day.level === 0) return "No plan";
  if (day.total === 0) return "Plan with no tasks";
  return `${day.done}/${day.total} tasks done`;
}

type ActivityGraphProps = {
  data: DayActivity[];
  className?: string;
};

export function ActivityGraph({ data, className }: ActivityGraphProps) {
  if (data.length === 0) return null;

  // Group into weeks (columns). Start from the weekday of the first day
  // so the grid aligns to calendar weeks (Sun = 0 … Sat = 6).
  const firstWeekday = getDay(parseISO(data[0].date)); // 0–6
  const cells: (DayActivity | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...data,
  ];

  const weeks: (DayActivity | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // Month labels: show the month name above the first week that contains day 1
  // of a month (or the very first cell).
  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = "";
  weeks.forEach((week, weekIndex) => {
    for (const cell of week) {
      if (!cell) continue;
      const month = format(parseISO(cell.date), "MMM");
      if (month !== lastMonth) {
        monthLabels.push({ weekIndex, label: month });
        lastMonth = month;
        break;
      }
    }
  });

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-end gap-3 overflow-x-auto pb-1">
        {/* Weekday labels */}
        <div className="flex flex-col gap-[3px] pt-[18px] text-[10px] leading-none text-muted-foreground">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={i} className="flex h-[11px] items-center">
              {label}
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          {/* Month labels */}
          <div className="relative mb-1.5 h-3.5 text-[10px] leading-none text-muted-foreground">
            {monthLabels.map(({ weekIndex, label }) => (
              <span
                key={`${label}-${weekIndex}`}
                className="absolute"
                style={{ left: `${weekIndex * 14}px` }} // 11px cell + 3px gap
              >
                {label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${weekIndex}-${dayIndex}`}
                        className="size-[11px]"
                      />
                    );
                  }

                  const title = `${format(parseISO(day.date), "MMM d, yyyy")}: ${levelLabel(day)}`;

                  return (
                    <div
                      key={day.date}
                      title={title}
                      className={cn(
                        "size-[11px] rounded-[2px] transition-colors",
                        LEVEL_CLASS[day.level],
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        {([0, 1, 2, 3, 4] as ActivityLevel[]).map((level) => (
          <div
            key={level}
            className={cn("size-[11px] rounded-[2px]", LEVEL_CLASS[level])}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
