import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EditNoteForm } from "./edit-note-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditNotePage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/signin");

  const { id } = await params;

  const [note, tags] = await Promise.all([
    prisma.note.findFirst({
      where: { id, userId: session.user.id },
      include: {
        tags: { include: { tag: true } },
      },
    }),
    prisma.tag.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!note) notFound();

  return (
    <EditNoteForm
      note={{
        id: note.id,
        title: note.title,
        description: note.description ?? "",
        tagIds: note.tags.map((nt) => nt.tagId),
      }}
      existingTags={tags}
    />
  );
}
