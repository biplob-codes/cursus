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

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <p className="mb-8 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Shared note
          {note.user?.name ? ` · ${note.user.name}` : null}
        </p>

        <article>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {note.title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Updated {format(note.updatedAt, "d MMM yyyy")}
          </p>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex h-7 items-center rounded-md bg-muted px-2 text-[13px] text-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

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
