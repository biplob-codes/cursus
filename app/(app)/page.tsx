import { TodaysPlansSection } from "@/components/todays-plan";
import { getActivityData } from "@/lib/activity";
import { todayDateOnly } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ActivityGraph } from "../activity-graph";

export default async function HomePage() {
  const user = await requireUser();
  const today = todayDateOnly();
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
      <TodaysPlansSection plans={todayPlans} />
      <section className="space-y-3">
        <ActivityGraph data={activity} />
      </section>
    </div>
  );
}
