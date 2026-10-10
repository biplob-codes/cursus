import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { SEMESTER_NAME_LABELS } from "@/schema/semester";
import { CoursesTable } from "./courses-table";
import { CoursesToolbar } from "./courses-toolbar";

type CoursesPageProps = {
  searchParams: Promise<{ semester?: string }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const semesters = await prisma.semester.findMany({
    where: { userId: user.id },
    orderBy: [{ year: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      year: true,
    },
  });

  const semesterOptions = semesters.map((s) => ({
    id: s.id,
    label: `${SEMESTER_NAME_LABELS[s.name]} ${s.year}`,
  }));

  // Default to most recent semester when none selected
  const requestedId = params.semester?.trim() || null;
  const activeSemester =
    (requestedId ? semesters.find((s) => s.id === requestedId) : undefined) ??
    semesters[0] ??
    null;

  const activeSemesterId = activeSemester?.id ?? null;

  const courses = activeSemesterId
    ? await prisma.course.findMany({
        where: {
          semesterId: activeSemesterId,
          semester: { userId: user.id },
        },
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          courseCode: true,
          credit: true,
          gradePoint: true,
          teacher: true,
          semester: {
            select: {
              name: true,
              year: true,
            },
          },
        },
      })
    : [];

  const title = activeSemester
    ? `${SEMESTER_NAME_LABELS[activeSemester.name]} ${activeSemester.year} courses`
    : "Courses";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h1>
        <CoursesToolbar
          semesters={semesterOptions}
          activeSemesterId={activeSemesterId}
        />
      </div>

      {!activeSemester ? (
        <p className="px-1 text-sm text-muted-foreground">
          No semesters yet.{" "}
          <Link
            href="/semesters"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Create a semester
          </Link>{" "}
          first, then add courses.
        </p>
      ) : courses.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">
          No courses in this semester.{" "}
          <Link
            href="/courses/new"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Add one
          </Link>
        </p>
      ) : (
        <CoursesTable courses={courses} />
      )}
    </div>
  );
}
