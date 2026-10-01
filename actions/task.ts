"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function toggleTaskDone(taskId: string, done: boolean) {
  const user = await getSessionUser();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      plan: { userId: user.id },
    },
    select: { id: true, planId: true },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await prisma.task.update({
    where: { id: task.id },
    data: { status: done ? "DONE" : "TODO" },
  });

  revalidatePath("/plans");
  revalidatePath(`/plans/${task.planId}`);
}
