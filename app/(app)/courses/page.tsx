import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { SEMESTER_NAME_LABELS } from "@/schema/semester";
import { Button } from "@/ui/button";

export default async function CoursesPage() {
  const user = await requireUser();

  const courses = await prisma.course.findMany({
    where: {
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
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Courses
        </h1>
        <Button
          className="w-full sm:w-auto"
          render={<Link href="/courses/new" />}
        >
          Create course
        </Button>
      </div>

      {courses.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">
          No courses yet.{" "}
          <Link
            href="/courses/new"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      ) : (
        <ul className="space-y-1">
          {courses.map((course) => (
            <li
              key={course.id}
              className="rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted/50"
            >
              <span className="font-medium">{course.title}</span>
              <span className="text-muted-foreground">
                {" "}
                · {course.courseCode} ·{" "}
                {SEMESTER_NAME_LABELS[course.semester.name]}{" "}
                {course.semester.year}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
