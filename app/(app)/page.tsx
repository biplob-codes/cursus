import { ActivityGraph } from "@/components/activity-graph";
import { ClassRoutine } from "@/components/class-routine";
import { TodaysPlansSection } from "@/components/todays-plan";
import { getActivityData } from "@/lib/activity";
import { todayDateOnly } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Home from "../home";

export default async function HomePage() {
  const session = await getSession();

  if (!session?.user) {
    return <Home />;
  }

  const user = session.user;
  const today = todayDateOnly();

  const [todayPlans, activity, latestSemester] = await Promise.all([
    prisma.plan.findMany({
      where: { userId: user.id, date: today },
      orderBy: { date: "desc" },
      include: { tasks: true },
    }),
    getActivityData(user.id),
    prisma.semester.findFirst({
      where: { userId: user.id },
      orderBy: [{ year: "desc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        year: true,
        courses: {
          select: {
            classes: {
              select: {
                id: true,
                day: true,
                startsAt: true,
                roomNo: true,
                course: {
                  select: {
                    title: true,
                    courseCode: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const routineClasses =
    latestSemester?.courses.flatMap((course) => course.classes) ?? [];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <TodaysPlansSection plans={todayPlans} />

      {latestSemester && (
        <ClassRoutine
          semester={{
            name: latestSemester.name,
            year: latestSemester.year,
          }}
          classes={routineClasses}
        />
      )}

      <section className="space-y-3">
        <ActivityGraph data={activity} />
      </section>
    </div>
  );
}
