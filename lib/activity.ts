// lib/activity.ts
import { startOfDay, subDays, format, eachDayOfInterval } from "date-fns";
import { prisma } from "@/lib/prisma";
import type { Task } from "@/generated/prisma/client";

/** 0 = no plan, 1 = 0% done, 2 = 1–49%, 3 = 50–99%, 4 = 100% */
export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export type DayActivity = {
  date: string; // yyyy-MM-dd
  level: ActivityLevel;
  total: number;
  done: number;
};

export function computeLevel(tasks: Pick<Task, "status">[]): ActivityLevel {
  if (tasks.length === 0) return 1; // plan exists but no tasks → treat as "started"
  const done = tasks.filter((t) => t.status === "DONE").length;
  const ratio = done / tasks.length;
  if (ratio === 0) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 1) return 3;
  return 4;
}

/**
 * Returns one entry per day for the last `days` days (inclusive of today).
 * Days with no plan get level 0.
 */
export async function getActivityData(
  userId: string,
  days = 365,
): Promise<DayActivity[]> {
  const end = startOfDay(new Date());
  const start = subDays(end, days - 1);

  const plans = await prisma.plan.findMany({
    where: {
      userId,
      date: { gte: start, lte: end },
    },
    select: {
      date: true,
      tasks: { select: { status: true } },
    },
  });

  // key = yyyy-MM-dd → level info
  const byDate = new Map<
    string,
    { total: number; done: number; level: ActivityLevel }
  >();
  for (const plan of plans) {
    const key = format(plan.date, "yyyy-MM-dd");
    const total = plan.tasks.length;
    const done = plan.tasks.filter((t) => t.status === "DONE").length;
    // if multiple plans on same day, take the higher level (or merge — here we overwrite with latest)
    byDate.set(key, {
      total,
      done,
      level: computeLevel(plan.tasks),
    });
  }

  return eachDayOfInterval({ start, end }).map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const entry = byDate.get(key);
    return {
      date: key,
      level: entry?.level ?? 0,
      total: entry?.total ?? 0,
      done: entry?.done ?? 0,
    };
  });
}
