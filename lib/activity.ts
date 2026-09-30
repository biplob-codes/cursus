import { startOfDay, subDays, format, eachDayOfInterval } from "date-fns";
import { prisma } from "@/lib/prisma";

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

// Uses the rounded percent so the level always matches what the tooltip shows
export function levelFromPercent(percent: number): ActivityLevel {
  if (percent <= 25) return 1;
  if (percent <= 50) return 2;
  if (percent <= 75) return 3;
  return 4;
}

/**
 * One entry per day for the last `days` days (inclusive of today).
 * Days with no plan or no tasks get level 0.
 */
export async function getActivityData(
  userId: string,
  days = 365,
): Promise<DayActivity[]> {
  const end = startOfDay(new Date());
  const start = subDays(end, days - 1);

  const plans = await prisma.plan.findMany({
    where: { userId, date: { gte: start, lte: end } },
    select: {
      date: true,
      tasks: { select: { status: true } },
    },
  });

  // Sum tasks across plans that land on the same day
  const byDate = new Map<string, { total: number; done: number }>();
  for (const plan of plans) {
    const key = format(plan.date, "yyyy-MM-dd");
    const prev = byDate.get(key) ?? { total: 0, done: 0 };
    byDate.set(key, {
      total: prev.total + plan.tasks.length,
      done: prev.done + plan.tasks.filter((t) => t.status === "DONE").length,
    });
  }

  return eachDayOfInterval({ start, end }).map((day) => {
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
