// app/(app)/plans/[id]/loading.tsx
import { Skeleton } from "@/ui/skeleton";

export default function PlanDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-64" />
      </div>

      <ul className="space-y-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-md px-2 py-2.5"
          >
            <Skeleton className="size-4 shrink-0 rounded" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-[55%]" />
              {i % 2 === 0 ? <Skeleton className="h-3 w-[35%]" /> : null}
            </div>
            <Skeleton className="h-5 w-14 rounded-md" />
          </li>
        ))}
      </ul>
    </div>
  );
}
