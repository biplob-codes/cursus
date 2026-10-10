"use server";

import { revalidatePath } from "next/cache";
import { ActionState } from "./action-state";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { createSemesterSchema } from "@/schema/semester";

export async function createSemester(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user?.id) {
    return {
      status: "error",
      message: "You must be signed in to create a semester.",
    };
  }

  const parsed = createSemesterSchema.safeParse({
    name: formData.get("name"),
    year: formData.get("year"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Fix the errors below",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, year } = parsed.data;

  try {
    await prisma.semester.create({
      data: {
        name,
        year,
        userId: user.id,
      },
    });
  } catch (error: unknown) {
    // Unique constraint (userId + name + year)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        status: "error",
        message: "You already have a semester with this name and year.",
      };
    }

    return {
      status: "error",
      message: "Couldn't create the semester. Try again.",
    };
  }

  revalidatePath("/semesters");
  return { status: "success", message: "Semester created." };
}
