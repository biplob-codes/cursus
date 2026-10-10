import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { SEMESTER_NAME_LABELS } from "@/schema/semester";
import { CourseDetailView } from "./course-detail-view";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const course = await prisma.course.findFirst({
    where: { id, semester: { userId: user.id } },
    include: {
      classes: {
        orderBy: [{ day: "asc" }, { startsAt: "asc" }],
      },
      semester: {
        select: { id: true, name: true, year: true },
      },
    },
  });

  if (!course) notFound();

  const semesters = await prisma.semester.findMany({
    where: { userId: user.id },
    orderBy: [{ year: "desc" }, { name: "asc" }],
    select: { id: true, name: true, year: true },
  });

  const semesterOptions = semesters.map((s) => ({
    id: s.id,
    label: `${SEMESTER_NAME_LABELS[s.name]} ${s.year}`,
  }));

  return (
    <CourseDetailView
      course={{
        id: course.id,
        title: course.title,
        courseCode: course.courseCode,
        credit: course.credit,
        gradePoint: course.gradePoint,
        teacher: course.teacher,
        semesterId: course.semesterId,
        classes: course.classes.map((c) => ({
          id: c.id,
          day: c.day,
          roomNo: c.roomNo,
          startsAt: c.startsAt,
          endsAt: c.endsAt,
        })),
      }}
      semesters={semesterOptions}
    />
  );
}
