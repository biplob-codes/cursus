import Link from "next/link";
import { BookOpen, Hash, User, GraduationCap } from "lucide-react";

type CourseRow = {
  id: string;
  title: string;
  courseCode: string;
  credit: number;
  gradePoint: number | null;
  teacher: string | null;
  semester: {
    name: string;
    year: number;
  };
};

export function CoursesTable({ courses }: { courses: CourseRow[] }) {
  if (courses.length === 0) {
    return (
      <p className="px-2 py-4 text-sm text-muted-foreground">No courses yet.</p>
    );
  }

  return (
    <>
      {/* Mobile: card list */}
      <div className="space-y-2 md:hidden">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-3 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {course.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {course.credit} cr
                {course.teacher ? ` · ${course.teacher}` : ""}
              </p>
            </div>

            {course.gradePoint !== null ? (
              <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                {course.gradePoint.toFixed(2)}
              </span>
            ) : (
              <span className="shrink-0 text-sm text-muted-foreground/50">
                —
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden w-full overflow-x-auto md:block">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-2 text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Title
                </span>
              </th>
              <th className="px-2 py-2 text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Credit hour
                </span>
              </th>
              <th className="px-2 py-2 text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <User className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Teacher
                </span>
              </th>
              <th className="px-2 py-2 text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.8} />
                  GPA
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={course.id}
                className="border-b border-border/70 hover:bg-muted/50"
              >
                <td className="px-2 py-2">
                  <Link
                    href={`/courses/${course.id}`}
                    className="block min-w-0 font-medium text-foreground hover:underline"
                  >
                    {course.title}
                  </Link>
                </td>
                <td className="px-2 py-2 tabular-nums text-muted-foreground">
                  {course.credit}
                </td>
                <td className="px-2 py-2 text-muted-foreground">
                  {course.teacher ? (
                    course.teacher
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </td>
                <td className="px-2 py-2 tabular-nums text-muted-foreground">
                  {course.gradePoint !== null ? (
                    course.gradePoint.toFixed(2)
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
