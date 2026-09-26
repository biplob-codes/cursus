import { prisma } from "@/lib/prisma";
import { Button } from "@/ui/button";
import Link from "next/link";
import { isSameDay, startOfDay } from "date-fns";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TodaysPlan } from "./todays-plan";
import { PlansTable } from "./plans-table";

export default async function PlansPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/signin");

  const plans = await prisma.plan.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    include: { tasks: true },
  });

  const today = startOfDay(new Date());
  const todayPlans = plans.filter((plan) => isSameDay(plan.date, today));
  const otherPlans = plans.filter((plan) => !isSameDay(plan.date, today));

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Plans
        </h1>
        <Button>
          <Link href="/plans/new">New plan</Link>
        </Button>
      </div>

      {plans.length === 0 ? (
        <p className="px-2 text-sm text-muted-foreground">
          No plans yet.{" "}
          <Link
            href="/plans/new"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      ) : (
        <>
          <section className="space-y-1">
            <h2 className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Today
            </h2>
            {todayPlans.length === 0 ? (
              <p className="px-2 py-2 text-sm text-muted-foreground">
                No plan for today.{" "}
                <Link
                  href="/plans/new"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  Create one
                </Link>
              </p>
            ) : (
              <div className="space-y-0.5">
                {todayPlans.map((plan) => (
                  <TodaysPlan key={plan.id} plan={plan} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-1">
            <h2 className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              All plans
            </h2>
            <PlansTable plans={otherPlans} />
          </section>
        </>
      )}
    </div>
  );
}
