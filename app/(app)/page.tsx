// app/(app)/page.tsx
import { startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getActivityData } from "@/lib/activity";
import { TodaysPlansSection } from "@/components/todays-plan";
import { ActivityGraph } from "../activity-graph";

export default async function HomePage() {
  const user = await requireUser();

  const today = startOfDay(new Date());

  const [todayPlans, activity] = await Promise.all([
    prisma.plan.findMany({
      where: { userId: user.id, date: today },
      orderBy: { date: "desc" },
      include: { tasks: true },
    }),
    getActivityData(user.id),
  ]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Home
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Today’s plan and your activity over the past year.
        </p>
      </div>

      <TodaysPlansSection plans={todayPlans} />

      <section className="space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Activity
        </h2>
        <ActivityGraph data={activity} />
      </section>
    </div>
  );
}
