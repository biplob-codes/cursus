import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { todayDateOnly } from "@/lib/date";
import { requireUser } from "@/lib/session";
import { TodaysPlansSection } from "@/components/todays-plan";
import { Button } from "@/ui/button";
import { Pagination } from "@/ui/pagination";
import { PlansTable } from "./plans-table";

const PAGE_SIZE = 7;

type PlansPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function PlansPage({ searchParams }: PlansPageProps) {
  const user = await requireUser();
  const userId = user.id;

  const params = await searchParams;
  const requestedPage = Math.max(1, Number(params.page) || 1);

  const today = todayDateOnly();

  const todayPlans = await prisma.plan.findMany({
    where: { userId, date: today },
    orderBy: { date: "desc" },
    include: { tasks: true },
  });

  const totalOtherPlans = await prisma.plan.count({
    where: { userId, date: { not: today } },
  });

  const totalPages = Math.max(1, Math.ceil(totalOtherPlans / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const skip = (page - 1) * PAGE_SIZE;

  const otherPlans = await prisma.plan.findMany({
    where: { userId, date: { not: today } },
    orderBy: { date: "desc" },
    skip,
    take: PAGE_SIZE,
    include: { tasks: true },
  });

  const hasAnyPlans = todayPlans.length > 0 || totalOtherPlans > 0;

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

      {!hasAnyPlans ? (
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
          <TodaysPlansSection plans={todayPlans} />

          <section className="space-y-1">
            <PlansTable plans={otherPlans} />
            <Pagination page={page} totalPages={totalPages} basePath="/plans" />
          </section>
        </>
      )}
    </div>
  );
}
