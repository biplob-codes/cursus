// app/(app)/notes/[id]/loading.tsx
import { Skeleton } from "@/ui/skeleton";

export default function NoteDetailLoading() {
  return (
    <article className="mx-auto w-full max-w-4xl">
      {/* Share controls */}
      <div className="mb-8 flex items-center justify-end gap-3">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="h-4 w-10" />
      </div>

      {/* Title */}
      <Skeleton className="h-9 w-3/4 max-w-md" />

      {/* Meta */}
      <div className="mt-3 flex items-center gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Body */}
      <div className="mt-10 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[75%]" />
        <Skeleton className="mt-6 h-4 w-full" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </article>
  );
}
