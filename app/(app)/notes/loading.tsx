// app/(app)/notes/loading.tsx
import { Skeleton } from "@/ui/skeleton";

export default function NotesLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 pb-4">
        <Skeleton className="h-8 w-20" />
        <div className="flex items-center gap-1">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="ml-1 h-8 w-14 rounded-lg" />
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <div className="flex border-b border-border px-2 py-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="ml-auto h-3 w-12" />
          <Skeleton className="ml-16 h-3 w-16" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border/70 px-2 py-2.5"
          >
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="ml-auto h-5 w-16 rounded-md" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
