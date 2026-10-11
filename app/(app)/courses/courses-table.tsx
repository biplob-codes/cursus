import Link from "next/link";
import { BookOpen, Sigma, User, GraduationCap } from "lucide-react";

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

function formatCredit(credit: number): string {
  return credit.toFixed(1);
}

function formatGpa(gradePoint: number | null): string {
  if (gradePoint === null || gradePoint === 0) return "N/A";
  return gradePoint.toFixed(2);
}

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
                {formatCredit(course.credit)} cr
                {course.teacher ? ` · ${course.teacher}` : ""}
              </p>
            </div>

            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
              {formatGpa(course.gradePoint)}
            </span>
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
                  <Sigma className="h-3.5 w-3.5" strokeWidth={1.8} />
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
                  {formatCredit(course.credit)}
                </td>
                <td className="px-2 py-2 text-muted-foreground">
                  {course.teacher ? (
                    course.teacher
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </td>
                <td className="px-2 py-2 tabular-nums text-muted-foreground">
                  {formatGpa(course.gradePoint)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
