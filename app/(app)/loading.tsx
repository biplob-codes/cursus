// app/(app)/loading.tsx
import { Skeleton } from "@/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
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
                <Skeleton className="h-3 w-3/4 max-w-xs" />
              </div>
              <Skeleton className="h-3 w-14 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Activity graph */}
      <section className="space-y-3">
        <Skeleton className="h-5 w-56" />
        <div className="space-y-3 rounded-lg border border-border p-4">
          <div className="grid grid-cols-[auto_repeat(12,minmax(0,1fr))] gap-[3px]">
            {Array.from({ length: 7 }).map((_, row) => (
              <div key={row} className="contents">
                <Skeleton className="h-3 w-6 self-center" />
                {Array.from({ length: 12 }).map((_, col) => (
                  <Skeleton
                    key={col}
                    className="aspect-square w-full rounded-[2px]"
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-12" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
