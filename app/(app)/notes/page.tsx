// app/(app)/notes/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { requireUser } from "@/lib/session";
import { formatUpdatedAt } from "@/lib/date";
import { NotesToolbar } from "./notes-toolbar";
import type { Prisma } from "@/generated/prisma/client";

type NotesPageProps = {
  searchParams: Promise<{ q?: string; tags?: string }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const user = await requireUser();
  const userId = user.id;

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
      select: {
        id: true,
        title: true,
        isPublic: true,
        updatedAt: true,
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
    <div className="mx-auto w-full max-w-4xl">
      {/* Stays put while the list scrolls inside main */}
      <div className="sticky top-0 z-10 -mx-2 bg-background px-2 pb-4 pt-0">
        <NotesToolbar
          tags={tags}
          selectedTagIds={selectedTagIds}
          query={query}
        />
      </div>

      {notes.length === 0 ? (
        <p className="px-2 pt-4 text-sm text-muted-foreground">
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
        <ul className="divide-y divide-border/70 my-5">
          {notes.map((note) => (
            <li key={note.id}>
              <Link
                href={`/notes/${note.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-3 transition-colors",
                  "hover:bg-muted/50",
                )}
              >
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {note.title}
                </span>

                <span
                  className={cn(
                    "shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                    note.isPublic
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {note.isPublic ? "Public" : "Private"}
                </span>

                <span className="w-24 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {formatUpdatedAt(note.updatedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
