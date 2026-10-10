import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { SEMESTER_NAME_LABELS } from "@/schema/semester";
import { CreateSemesterDialog } from "./create-semester-dialog";

export default async function SemestersPage() {
  const user = await requireUser();
  const semesters = await prisma.semester.findMany({
    where: { userId: user.id },
    orderBy: [{ year: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      year: true,
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
        <ul className="space-y-1">
          {semesters.map((semester) => (
            <li
              key={semester.id}
              className="rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted/50"
            >
              {SEMESTER_NAME_LABELS[semester.name]} {semester.year}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
