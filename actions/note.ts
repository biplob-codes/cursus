"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ActionState } from "./action-state";
import { createNoteSchema, updateNoteSchema } from "@/schema/note";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function resolveTagIds(
  userId: string,
  existingTagIds: string[],
  namesToCreate: string[],
) {
  const uniqueNewNames = [
    ...new Map(
      namesToCreate.map((n) => [n.toLowerCase(), n] as const),
    ).values(),
  ];

  if (existingTagIds.length > 0) {
    const owned = await prisma.tag.count({
      where: { userId, id: { in: existingTagIds } },
    });
    if (owned !== existingTagIds.length) {
      throw new Error("INVALID_TAGS");
    }
  }

  const createdTagIds: string[] = [];

  for (const name of uniqueNewNames) {
    const tag = await prisma.tag.upsert({
      where: { userId_name: { userId, name } },
      create: { name, userId },
      update: {},
      select: { id: true },
    });
    createdTagIds.push(tag.id);
  }

  return [...new Set([...existingTagIds, ...createdTagIds])];
}

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

  try {
    const allTagIds = await resolveTagIds(
      userId,
      existingTagIds,
      namesToCreate,
    );

    await prisma.note.create({
      data: {
        title,
        description,
        userId,
        tags:
          allTagIds.length > 0
            ? { create: allTagIds.map((tagId) => ({ tagId })) }
            : undefined,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_TAGS") {
      return { status: "error", message: "One or more tags are invalid." };
    }
    return {
      status: "error",
      message: "Couldn't save the note. Try again.",
    };
  }

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNote(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return {
      status: "error",
      message: "You must be signed in to update a note.",
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

  const parsed = updateNoteSchema.safeParse({
    id: formData.get("id"),
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
    id,
    title,
    description,
    tagIds: existingTagIds,
    newTagNames: namesToCreate,
  } = parsed.data;

  const existing = await prisma.note.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) {
    return { status: "error", message: "Note not found." };
  }

  try {
    const allTagIds = await resolveTagIds(
      userId,
      existingTagIds,
      namesToCreate,
    );

    await prisma.$transaction(async (tx) => {
      await tx.noteTag.deleteMany({ where: { noteId: id } });

      await tx.note.update({
        where: { id },
        data: {
          title,
          description: description ?? null,
          tags:
            allTagIds.length > 0
              ? { create: allTagIds.map((tagId) => ({ tagId })) }
              : undefined,
        },
      });
    });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_TAGS") {
      return { status: "error", message: "One or more tags are invalid." };
    }
    return {
      status: "error",
      message: "Couldn't update the note. Try again.",
    };
  }

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  redirect(`/notes/${id}`);
}
