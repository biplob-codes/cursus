"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ActionState } from "./action-state";
import { createNoteSchema } from "@/schema/note";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function createNote(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return {
      status: "error",
      message: "You must be signed in to create a note.",
    };
  }

  const userId = session.user.id;

  let tagIds: unknown = [];
  let newTagNames: unknown = [];
  try {
    tagIds = JSON.parse(String(formData.get("tagIds") ?? "[]"));
    newTagNames = JSON.parse(String(formData.get("newTagNames") ?? "[]"));
  } catch {
    return {
      status: "error",
      message: "Something went wrong reading the tags. Try again.",
    };
  }

  const parsed = createNoteSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    tagIds,
    newTagNames,
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
    description,
    tagIds: existingTagIds,
    newTagNames: namesToCreate,
  } = parsed.data;

  // Deduplicate new names (case-insensitive)
  const uniqueNewNames = [
    ...new Map(
      namesToCreate.map((n) => [n.toLowerCase(), n] as const),
    ).values(),
  ];

  try {
    // Ensure every existing tagId belongs to this user
    if (existingTagIds.length > 0) {
      const owned = await prisma.tag.count({
        where: { userId, id: { in: existingTagIds } },
      });
      if (owned !== existingTagIds.length) {
        return {
          status: "error",
          message: "One or more tags are invalid.",
        };
      }
    }

    await prisma.$transaction(async (tx) => {
      const createdTagIds: string[] = [];

      for (const name of uniqueNewNames) {
        const tag = await tx.tag.upsert({
          where: {
            userId_name: { userId, name },
          },
          create: { name, userId },
          update: {},
          select: { id: true },
        });
        createdTagIds.push(tag.id);
      }

      const allTagIds = [...new Set([...existingTagIds, ...createdTagIds])];

      const note = await tx.note.create({
        data: {
          title,
          description,
          userId,
          tags:
            allTagIds.length > 0
              ? {
                  create: allTagIds.map((tagId) => ({ tagId })),
                }
              : undefined,
        },
      });

      return note;
    });
  } catch {
    return {
      status: "error",
      message: "Couldn't save the note. Try again.",
    };
  }

  revalidatePath("/notes");
  redirect("/notes");
}
