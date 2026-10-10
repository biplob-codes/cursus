import Link from "next/link";
import type { Semester } from "@/generated/prisma/client";
import { SEMESTER_NAME_LABELS } from "@/schema/semester";
import { BookOpen, Hash, GraduationCap } from "lucide-react";

type CourseStats = {
  id: string;
  credit: number;
  gradePoint: number | null;
};

type SemesterWithCourses = Semester & { courses: CourseStats[] };

function calcSemesterStats(courses: CourseStats[]) {
  const attemptedCredits = courses.reduce((sum, c) => sum + c.credit, 0);

  const graded = courses.filter(
    (c) => c.gradePoint !== null && c.gradePoint !== undefined,
  );

  if (graded.length === 0) {
    return { attemptedCredits, sgpa: null as number | null };
  }

  const weighted = graded.reduce(
    (sum, c) => sum + c.credit * (c.gradePoint as number),
    0,
  );
  const gradedCredits = graded.reduce((sum, c) => sum + c.credit, 0);
  const sgpa = gradedCredits > 0 ? weighted / gradedCredits : null;

  return { attemptedCredits, sgpa };
}

function formatSgpa(sgpa: number | null) {
  if (sgpa === null) return null;
  return sgpa.toFixed(2);
}

export function SemestersTable({
  semesters,
}: {
  semesters: SemesterWithCourses[];
}) {
  if (semesters.length === 0) {
    return (
      <p className="px-2 py-4 text-sm text-muted-foreground">
        No semesters yet.
      </p>
    );
  }

  return (
    <>
      {/* Mobile: card list */}
      <div className="space-y-2 md:hidden">
        {semesters.map((semester) => {
          const { attemptedCredits, sgpa } = calcSemesterStats(
            semester.courses,
          );
          const title = `${SEMESTER_NAME_LABELS[semester.name]} ${semester.year}`;

          return (
            <Link
              key={semester.id}
              href={`/semesters/${semester.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {attemptedCredits > 0
                    ? `${attemptedCredits} credits`
                    : "No courses"}
                </p>
              </div>

              {sgpa !== null ? (
                <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                  {formatSgpa(sgpa)}
                </span>
              ) : (
                <span className="shrink-0 text-sm text-muted-foreground/50">
                  —
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden w-full overflow-x-auto md:block">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-2 text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Semester
                </span>
              </th>
              <th className="px-2 py-2 text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Attempted credits
                </span>
              </th>
              <th className="px-2 py-2 text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.8} />
                  SGPA
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {semesters.map((semester) => {
              const { attemptedCredits, sgpa } = calcSemesterStats(
                semester.courses,
              );
              const title = `${SEMESTER_NAME_LABELS[semester.name]} ${semester.year}`;

              return (
                <tr
                  key={semester.id}
                  className="border-b border-border/70 hover:bg-muted/50"
                >
                  <td className="px-2 py-2">
                    <Link
                      href={`/semesters/${semester.id}`}
                      className="block min-w-0 font-medium text-foreground hover:underline"
                    >
                      {title}
                    </Link>
                  </td>
                  <td className="px-2 py-2 tabular-nums text-muted-foreground">
                    {attemptedCredits > 0 ? (
                      attemptedCredits
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </td>
                  <td className="px-2 py-2 tabular-nums text-muted-foreground">
                    {sgpa !== null ? (
                      formatSgpa(sgpa)
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
