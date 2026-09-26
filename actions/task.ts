"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function toggleTaskDone(taskId: string, done: boolean) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      plan: { userId: session.user.id },
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
