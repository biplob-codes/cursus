"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTaskDone(taskId: string, done: boolean) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status: done ? "DONE" : "TODO" },
  });

  revalidatePath("/plans");
}
