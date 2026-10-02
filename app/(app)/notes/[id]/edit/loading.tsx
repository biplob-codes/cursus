// app/(app)/notes/[id]/edit/loading.tsx
import { Skeleton } from "@/ui/skeleton";

export default function EditNoteLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-full max-w-sm" />
      <div className="flex gap-2">
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-7 w-20 rounded-md" />
      </div>
      <div className="space-y-3 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[70%]" />
      </div>
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-14" />
      </div>
    </div>
  );
}
