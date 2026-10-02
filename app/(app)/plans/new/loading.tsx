// app/(app)/plans/new/loading.tsx
import { Skeleton } from "@/ui/skeleton";

export default function NewPlanLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-10 py-12">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-20 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <Skeleton className="h-8 w-28 rounded-lg" />
    </div>
  );
}
