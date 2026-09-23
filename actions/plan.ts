"use server";

import { revalidatePath } from "next/cache";
import { ActionState } from "./action-state";
import { createPlanWithTasksSchema } from "@/schema/plan";
import { prisma } from "@/lib/prisma";

export async function createPlanWithTasks(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Tasks are built up client-side and shipped as one JSON blob (see
  // create-plan-view.tsx's hidden "tasksJson" input) rather than as
  // indexed form fields — much simpler to serialize an array that way.
  let rawTasks: unknown;
  try {
    rawTasks = JSON.parse(String(formData.get("tasksJson") ?? "[]"));
  } catch {
    return {
      status: "error",
      message: "Something went wrong reading the tasks. Try again.",
    };
  }

  const parsed = createPlanWithTasksSchema.safeParse({
    date: formData.get("date"),
    note: formData.get("note"),
    tasks: rawTasks,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Fix the errors below",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { date, note, tasks } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const plan = await tx.plan.create({ data: { date, note } });

      if (tasks.length > 0) {
        await tx.task.createMany({
          data: tasks.map((task) => ({ ...task, planId: plan.id })),
        });
      }
    });
  } catch {
    return { status: "error", message: "Couldn't save the plan. Try again." };
  }

  revalidatePath("/plans");

  return { status: "success", message: "Plan created" };
}
