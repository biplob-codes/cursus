"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionState } from "./action-state";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import {
  createClassSchema,
  createCourseSchema,
  updateCourseSchema,
} from "@/schema/course";

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

  let rawClasses: unknown = [];
  try {
    rawClasses = JSON.parse(String(formData.get("classesJson") ?? "[]"));
  } catch {
    return {
      status: "error",
      message: "Something went wrong reading the classes. Try again.",
    };
  }

  const parsed = createCourseSchema.safeParse({
    title: formData.get("title"),
    courseCode: formData.get("courseCode"),
    credit: formData.get("credit"),
    gradePoint: formData.get("gradePoint"),
    teacher: formData.get("teacher"),
    semesterId: formData.get("semesterId"),
    classes: rawClasses,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Fix the errors below",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const {
    title,
    courseCode,
    credit,
    gradePoint,
    teacher,
    semesterId,
    classes,
  } = parsed.data;

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
    await prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          title,
          courseCode,
          credit,
          gradePoint: gradePoint ?? null,
          teacher: teacher ?? null,
          semesterId,
        },
      });

      if (classes.length > 0) {
        await tx.class.createMany({
          data: classes.map((c) => ({
            courseId: course.id,
            day: c.day,
            roomNo: c.roomNo ?? null,
            startsAt: c.startsAt,
            endsAt: c.endsAt ?? null,
          })),
        });
      }
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

export async function updateCourse(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user?.id) {
    return {
      status: "error",
      message: "You must be signed in to update a course.",
    };
  }

  const parsed = updateCourseSchema.safeParse({
    id: formData.get("id"),
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

  const { id, title, courseCode, credit, gradePoint, teacher, semesterId } =
    parsed.data;

  const existing = await prisma.course.findFirst({
    where: { id, semester: { userId: user.id } },
    select: { id: true },
  });

  if (!existing) {
    return { status: "error", message: "Course not found." };
  }

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
    await prisma.course.update({
      where: { id },
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
      message: "Couldn't update the course. Try again.",
    };
  }

  revalidatePath("/courses");
  revalidatePath(`/courses/${id}`);
  revalidatePath("/semesters");
  return { status: "success", message: "Course updated." };
}

export async function createClass(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user?.id) {
    return {
      status: "error",
      message: "You must be signed in to add a class.",
    };
  }

  const parsed = createClassSchema.safeParse({
    courseId: formData.get("courseId"),
    day: formData.get("day"),
    roomNo: formData.get("roomNo"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Fix the errors below",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { courseId, day, roomNo, startsAt, endsAt } = parsed.data;

  const course = await prisma.course.findFirst({
    where: { id: courseId, semester: { userId: user.id } },
    select: { id: true },
  });

  if (!course) {
    return { status: "error", message: "Course not found." };
  }

  try {
    await prisma.class.create({
      data: {
        courseId,
        day,
        roomNo: roomNo ?? null,
        startsAt,
        endsAt: endsAt ?? null,
      },
    });
  } catch {
    return {
      status: "error",
      message: "Couldn't add the class. Try again.",
    };
  }

  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/courses");
  return { status: "success", message: "Class added." };
}
