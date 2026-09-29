import { prisma } from "@/lib/prisma";
import { Button } from "@/ui/button";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/signin");

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Notes
        </h1>
        <Button>
          <Link href="/notes/new">New note</Link>
        </Button>
      </div>

      {notes.length === 0 ? (
        <p className="px-2 text-sm text-muted-foreground">
          No notes yet.{" "}
          <Link
            href="/notes/new"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      ) : (
        <ul className="divide-y divide-border/70">
          {notes.map((note) => {
            const tags = note.tags.map((nt) => nt.tag);
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
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
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
