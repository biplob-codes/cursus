import { prisma } from "@/lib/prisma";
import { Button } from "@/ui/button";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import { NotesFilters } from "./notes-filters";
import type { Prisma } from "@/generated/prisma/client";

type NotesPageProps = {
  searchParams: Promise<{ q?: string; tags?: string }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/signin");

  const userId = session.user.id;
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const selectedTagIds = (params.tags ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const where: Prisma.NoteWhereInput = {
    userId,
    ...(query ? { title: { contains: query, mode: "insensitive" } } : {}),
    ...(selectedTagIds.length > 0
      ? {
          AND: selectedTagIds.map((tagId) => ({
            tags: { some: { tagId } },
          })),
        }
      : {}),
  };

  const [notes, tags] = await Promise.all([
    prisma.note.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    }),
    prisma.tag.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const hasFilters = query.length > 0 || selectedTagIds.length > 0;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Notes
        </h1>
        <Button>
          <Link href="/notes/new">New note</Link>
        </Button>
      </div>

      <NotesFilters tags={tags} selectedTagIds={selectedTagIds} query={query} />

      {notes.length === 0 ? (
        <p className="px-2 text-sm text-muted-foreground">
          {hasFilters ? (
            <>No notes match these filters.</>
          ) : (
            <>
              No notes yet.{" "}
              <Link
                href="/notes/new"
                className="text-foreground underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </>
          )}
        </p>
      ) : (
        <ul className="divide-y divide-border/70">
          {notes.map((note) => {
            const noteTags = note.tags.map((nt) => nt.tag);
            return (
              <li key={note.id}>
                <Link
                  href={`/notes/${note.id}`}
                  className={cn(
                    "flex flex-col gap-1.5 rounded-md px-2 py-3 transition-colors",
                    "hover:bg-muted/50",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="min-w-0 truncate font-medium text-foreground">
                      {note.title}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {formatDistanceToNowStrict(note.updatedAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {noteTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {noteTags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
