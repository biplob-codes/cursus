import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { toDateString, todayDateOnly } from "@/lib/date";

/**
 * 0 = no plan / no tasks
 * 1 = 0–25%
 * 2 = 26–50%
 * 3 = 51–75%
 * 4 = 76–100%
 */
export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export const LEVEL_LABEL: Record<ActivityLevel, string> = {
  0: "No plan",
  1: "0–25%",
  2: "26–50%",
  3: "51–75%",
  4: "76–100%",
};

export type DayActivity = {
  date: string; // yyyy-MM-dd
  level: ActivityLevel;
  total: number;
  done: number;
  percent: number; // 0–100, rounded
};

/** Uses the rounded percent so the level always matches what the tooltip shows. */
export function levelFromPercent(percent: number): ActivityLevel {
  if (percent <= 25) return 1;
  if (percent <= 50) return 2;
  if (percent <= 75) return 3;
  return 4;
}

/**
 * One entry per day for the last `days` days (inclusive of today).
 * Days with no plan or no tasks get level 0.
 *
 * Query bounds use date-only (UTC noon) so they match Plan.date storage.
 * Graph keys use the local calendar day so the contribution grid matches the user.
 */
export async function getActivityData(
  userId: string,
  days = 365,
): Promise<DayActivity[]> {
  const endDateOnly = todayDateOnly();
  const startDateOnly = new Date(
    Date.UTC(
      endDateOnly.getUTCFullYear(),
      endDateOnly.getUTCMonth(),
      endDateOnly.getUTCDate() - (days - 1),
      12,
      0,
      0,
    ),
  );

  const plans = await prisma.plan.findMany({
    where: {
      userId,
      date: { gte: startDateOnly, lte: endDateOnly },
    },
    select: {
      date: true,
      tasks: { select: { status: true } },
    },
  });

  // Sum tasks across plans that land on the same calendar day (UTC parts).
  const byDate = new Map<string, { total: number; done: number }>();
  for (const plan of plans) {
    const key = toDateString(plan.date);
    const prev = byDate.get(key) ?? { total: 0, done: 0 };
    byDate.set(key, {
      total: prev.total + plan.tasks.length,
      done: prev.done + plan.tasks.filter((t) => t.status === "DONE").length,
    });
  }

  // Local calendar interval for the contribution graph (weekdays, month labels).
  const endLocal = startOfDay(new Date());
  const startLocal = subDays(endLocal, days - 1);

  return eachDayOfInterval({ start: startLocal, end: endLocal }).map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const { total, done } = byDate.get(key) ?? { total: 0, done: 0 };
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return {
      date: key,
      level: total === 0 ? 0 : levelFromPercent(percent),
      total,
      done,
      percent,
    };
  });
}
