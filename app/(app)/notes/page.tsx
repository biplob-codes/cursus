// app/(app)/notes/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { NotesToolbar } from "./notes-toolbar";
import { NotesTable } from "./notes-table";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 10;

type NotesPageProps = {
  searchParams: Promise<{ q?: string; tags?: string; page?: string }>;
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
  const requestedPage = Math.max(1, Number(params.page) || 1);

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

  const [totalNotes, tags] = await Promise.all([
    prisma.note.count({ where }),
    prisma.tag.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalNotes / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const skip = (page - 1) * PAGE_SIZE;

  const notes = await prisma.note.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    skip,
    take: PAGE_SIZE,
    select: {
      id: true,
      title: true,
      isPublic: true,
      updatedAt: true,
    },
  });

  const hasFilters = query.length > 0 || selectedTagIds.length > 0;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="sticky top-0 z-10 -mx-2 bg-background px-2 pb-4">
        <NotesToolbar
          tags={tags}
          selectedTagIds={selectedTagIds}
          query={query}
        />
      </div>

      {totalNotes === 0 ? (
        <p className="px-2 pt-2 text-sm text-muted-foreground">
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
        <NotesTable notes={notes} />
      )}
    </div>
  );
}
