import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { CreateSemesterDialog } from "./create-semester-dialog";
import { SemestersTable } from "./semesters-table";

export default async function SemestersPage() {
  const user = await requireUser();

  const semesters = await prisma.semester.findMany({
    where: { userId: user.id },
    orderBy: [{ year: "desc" }, { name: "asc" }],
    include: {
      courses: {
        select: {
          id: true,
          credit: true,
          gradePoint: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Semesters
        </h1>
        <CreateSemesterDialog />
      </div>

      {semesters.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">
          No semesters yet. Create one to start adding courses.
        </p>
      ) : (
        <SemestersTable semesters={semesters} />
      )}
    </div>
  );
}
