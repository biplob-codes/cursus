import { notFound } from "next/navigation";
import { formatUpdatedAt } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ShareControls } from "./share-controls";
import { NoteBody } from "@/components/note-body";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;

  const note = await prisma.note.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!note) notFound();

  const tags = note.tags.map((nt) => nt.tag);

  return (
    <article className="mx-auto w-full max-w-4xl">
      <div className="mb-8">
        <ShareControls
          noteId={note.id}
          isPublic={note.isPublic}
          shareToken={note.shareToken}
        />
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {note.title}
      </h1>

      <div className="mt-2 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        <span className="shrink-0">
          Last updated {formatUpdatedAt(note.updatedAt)}
        </span>

        {tags.length > 0 && (
          <>
            <span className="shrink-0" aria-hidden>
              ·
            </span>
            <span
              className="min-w-0 truncate text-foreground"
              title={tags.map((t) => t.name).join(", ")}
            >
              {tags.map((tag, i) => (
                <span key={tag.id}>
                  {i > 0 && <span className="mx-1.5"> </span>}
                  {tag.name}
                </span>
              ))}
            </span>
          </>
        )}
      </div>

      <NoteBody html={note.description} className="mt-10" />
    </article>
  );
}
