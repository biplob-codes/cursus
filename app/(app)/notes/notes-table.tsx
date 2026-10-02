// app/(app)/notes/notes-table.tsx
import Link from "next/link";
import { FileText, Shield, Clock } from "lucide-react";
import { formatUpdatedAt } from "@/lib/date";
import { NoteVisibilityToggle } from "./note-visibility-toggle";

export type NotesTableRow = {
  id: string;
  title: string;
  isPublic: boolean;
  updatedAt: Date;
};

export function NotesTable({ notes }: { notes: NotesTableRow[] }) {
  if (notes.length === 0) {
    return (
      <p className="px-2 py-4 text-sm text-muted-foreground">No notes yet.</p>
    );
  }

  return (
    <div className="w-full overflow-x-auto mt-5 mb-2">
      <table className="w-full min-w-[560px] table-fixed border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="w-auto px-2 py-2 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <FileText className="h-3.5 w-3.5" strokeWidth={1.8} />
                Title
              </span>
            </th>
            <th className="w-28 px-2 py-2 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Shield className="h-3.5 w-3.5" strokeWidth={1.8} />
                Status
              </span>
            </th>
            <th className="w-36 px-2 py-2 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
                Last edited
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr
              key={note.id}
              className="border-b border-border/70 hover:bg-muted/50"
            >
              <td className="max-w-0 px-2 py-2">
                <Link
                  href={`/notes/${note.id}`}
                  title={note.title}
                  className="block truncate font-medium text-foreground hover:underline"
                >
                  {note.title}
                </Link>
              </td>
              <td className="px-2 py-2">
                <NoteVisibilityToggle
                  noteId={note.id}
                  isPublic={note.isPublic}
                />
              </td>
              <td className="px-2 py-2 whitespace-nowrap text-muted-foreground">
                {formatUpdatedAt(note.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
