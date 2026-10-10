import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { SEMESTER_NAME_LABELS } from "@/schema/semester";
import { CreateCourseForm } from "./create-course-form";

export default async function NewCoursePage() {
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

  const semesterOptions = semesters.map((s) => ({
    id: s.id,
    label: `${SEMESTER_NAME_LABELS[s.name]} ${s.year}`,
  }));

  return <CreateCourseForm semesters={semesterOptions} />;
}
