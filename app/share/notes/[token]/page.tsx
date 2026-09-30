// app/share/notes/[token]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function SharedNotePage({ params }: Props) {
  const { token } = await params;

  const note = await prisma.note.findFirst({
    where: {
      shareToken: token,
      isPublic: true,
    },
    include: {
      tags: {
        include: { tag: true },
      },
      user: {
        select: { name: true },
      },
    },
  });

  if (!note) notFound();

  const tags = note.tags.map((nt) => nt.tag);
  const tagsTitle = tags.map((t) => t.name).join(", ");

  return (
    // Own scroll container — body/html may use overflow-hidden for the app shell
    <div className="app-scroll h-svh overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:px-8">
        <p className="mb-8 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Shared note
          {note.user?.name ? ` · ${note.user.name}` : null}
        </p>

        <article>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {note.title}
          </h1>

          <div className="mt-2 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <span className="shrink-0">
              Last updated {format(note.updatedAt, "d MMM yyyy")}
            </span>

            {tags.length > 0 && (
              <>
                <span className="shrink-0" aria-hidden>
                  ·
                </span>
                <span className="min-w-0 truncate" title={tagsTitle}>
                  {tags.map((tag, i) => (
                    <span key={tag.id}>
                      {i > 0 ? ", " : null}
                      {tag.name}
                    </span>
                  ))}
                </span>
              </>
            )}
          </div>

          {note.description ? (
            <div
              className="prose prose-sm dark:prose-invert mt-10 max-w-none text-foreground
                [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold
                [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
                [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: note.description }}
            />
          ) : (
            <p className="mt-10 text-sm text-muted-foreground/50">
              No content yet.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
