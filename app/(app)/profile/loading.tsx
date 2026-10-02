// app/(app)/profile/loading.tsx
import { Skeleton } from "@/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <Skeleton className="h-8 w-24" />

      <section className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center gap-4 rounded-lg border border-border bg-accent/20 px-4 py-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid max-w-sm grid-cols-2 gap-3">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </section>

      <section className="space-y-4 border-t border-border pt-8">
        <div className="space-y-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </section>
    </div>
  );
}
