"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format, parseISO, getDay } from "date-fns";
import { cn } from "@/lib/utils";
import type { DayActivity, ActivityLevel } from "@/lib/activity";

const LEVEL_CLASS: Record<ActivityLevel, string> = {
  0: "bg-muted ring-1 ring-inset ring-border",
  1: "bg-red-500",
  2: "bg-violet-500",
  3: "bg-indigo-400",
  4: "bg-green-500",
};

const LEVEL_LABEL: Record<ActivityLevel, string> = {
  0: "No plan",
  1: "0–25%",
  2: "26–50%",
  3: "51–75%",
  4: "76–100%",
};

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const LEVELS: ActivityLevel[] = [0, 1, 2, 3, 4];

/** Minimum pixel size for a day cell before we drop older weeks */
const MIN_CELL_PX = 11;
const GAP_PX = 3;
const LABEL_COL_PX = 28;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setWidth(el.clientWidth);

    return () => ro.disconnect();
  }, []);

  const maxWeeks = useMemo(() => {
    if (width <= 0) return 5; // ~1 month on first paint
    const available = Math.max(0, width - LABEL_COL_PX);
    const weekWidth = MIN_CELL_PX + GAP_PX;
    return Math.max(4, Math.floor(available / weekWidth));
  }, [width]);

  const visible = useMemo(() => {
    if (data.length === 0) return [];
    const maxDays = maxWeeks * 7;
    return data.slice(-maxDays);
  }, [data, maxWeeks]);

  if (visible.length === 0) return null;

  const totalDone = visible.reduce((sum, d) => sum + d.done, 0);

  const firstWeekday = getDay(parseISO(visible[0].date));
  const weekCount = Math.ceil((firstWeekday + visible.length) / 7);

  const positioned = visible.map((day, i) => {
    const offset = firstWeekday + i;
    return {
      day,
      col: Math.floor(offset / 7) + 2,
      row: (offset % 7) + 2,
    };
  });

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
      <p className="my-2 text-foreground">
        <span className="font-semibold">{totalDone}</span>{" "}
        {totalDone === 1 ? "task" : "tasks"} completed in the last{" "}
        {visible.length} days
      </p>

      <div
        ref={containerRef}
        className="space-y-3 rounded-lg border border-border p-3 sm:p-4"
      >
        <div
          className="grid w-full gap-[3px]"
          style={{
            gridTemplateColumns: `auto repeat(${weekCount}, minmax(0, 1fr))`,
          }}
        >
          {monthLabels.map(({ col, label }) => (
            <div
              key={`${label}-${col}`}
              className="whitespace-nowrap pb-1 text-xs leading-none text-foreground"
              style={{ gridColumn: col, gridRow: 1 }}
            >
              {label}
            </div>
          ))}

          {WEEKDAY_LABELS.map((label, i) => (
            <div
              key={i}
              className="flex items-center pr-1.5 text-[10px] leading-none text-muted-foreground sm:pr-2 sm:text-xs sm:text-foreground"
              style={{ gridColumn: 1, gridRow: i + 2 }}
            >
              {label}
            </div>
          ))}

          {positioned.map(({ day, col, row }) => (
            <div
              key={day.date}
              title={dayTitle(day)}
              className={cn(
                "aspect-square w-full min-w-0 rounded-[2px]",
                LEVEL_CLASS[day.level],
              )}
              style={{ gridColumn: col, gridRow: row }}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground sm:justify-end sm:gap-x-4">
          {LEVELS.map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <div
                className={cn("size-2.75 rounded-[3px]", LEVEL_CLASS[level])}
              />
              <span>{LEVEL_LABEL[level]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
