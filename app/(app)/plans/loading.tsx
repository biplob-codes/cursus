// app/(app)/plans/loading.tsx
import { Skeleton } from "@/ui/skeleton";

export default function PlansLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      {/* Today section */}
      <section className="space-y-1">
        <Skeleton className="mx-2 h-3 w-12" />
        <div className="space-y-0.5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-4 px-2 py-2.5"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-3 w-14 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Table */}
      <section className="space-y-1">
        <div className="flex gap-8 border-b border-border px-2 py-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-8 border-b border-border/70 px-2 py-2.5"
          >
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-1.5 w-24 rounded-full" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </section>
    </div>
  );
}
