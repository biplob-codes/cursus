"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionState } from "./action-state";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { createCourseSchema } from "@/schema/course";

export async function createCourse(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user?.id) {
    return {
      status: "error",
      message: "You must be signed in to create a course.",
    };
  }

  const parsed = createCourseSchema.safeParse({
    title: formData.get("title"),
    courseCode: formData.get("courseCode"),
    credit: formData.get("credit"),
    gradePoint: formData.get("gradePoint"),
    teacher: formData.get("teacher"),
    semesterId: formData.get("semesterId"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Fix the errors below",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { title, courseCode, credit, gradePoint, teacher, semesterId } =
    parsed.data;

  // Ensure the semester belongs to this user
  const semester = await prisma.semester.findFirst({
    where: { id: semesterId, userId: user.id },
    select: { id: true },
  });

  if (!semester) {
    return {
      status: "error",
      message: "Selected semester was not found.",
    };
  }

  try {
    await prisma.course.create({
      data: {
        title,
        courseCode,
        credit,
        gradePoint: gradePoint ?? null,
        teacher: teacher ?? null,
        semesterId,
      },
    });
  } catch {
    return {
      status: "error",
      message: "Couldn't create the course. Try again.",
    };
  }

  revalidatePath("/courses");
  revalidatePath("/semesters");
  redirect("/courses");
}
