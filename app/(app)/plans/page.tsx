import { prisma } from "@/lib/prisma";
import { Button } from "@/ui/button";
import Link from "next/link";
import { PlanListItem } from "./plan-list-item";

export default async function PlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { date: "desc" },
    include: { tasks: true },
  });

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Plans
        </h1>
        <Button className="">
          <Link href="/plans/new">New plan</Link>
        </Button>
      </div>

      {plans.length === 0 ? (
        <p className="px-2 text-sm text-muted-foreground">No plans yet.</p>
      ) : (
        <div className="space-y-0.5">
          {plans.map((plan) => (
            <PlanListItem key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
