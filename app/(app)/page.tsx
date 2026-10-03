import { ActivityGraph } from "@/components/activity-graph";
import { TodaysPlansSection } from "@/components/todays-plan";
import { getActivityData } from "@/lib/activity";
import { todayDateOnly } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Home from "../home";

export default async function HomePage() {
  const session = await getSession();

  // Unauthenticated → marketing page at the correct URL (/)
  if (!session?.user) {
    return <Home />;
  }

  const user = session.user;
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
