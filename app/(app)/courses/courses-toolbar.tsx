"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Check, ListFilter } from "lucide-react";
import { Button } from "@/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { cn } from "@/lib/utils";

export type SemesterOption = {
  id: string;
  label: string;
};

export function CoursesToolbar({
  semesters,
  activeSemesterId,
}: {
  semesters: SemesterOption[];
  activeSemesterId: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectSemester = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("semester", id);
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              aria-label="Filter by semester"
              disabled={semesters.length === 0}
            />
          }
        >
          <ListFilter className="h-4 w-4" />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56 p-1">
          {semesters.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              No semesters yet
            </p>
          ) : (
            <ul className="space-y-0.5">
              {semesters.map((s) => {
                const isActive = s.id === activeSemesterId;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => selectSemester(s.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                        isActive
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <span className="flex-1 truncate">{s.label}</span>
                      {isActive && (
                        <Check className="h-3.5 w-3.5 shrink-0 text-foreground" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </PopoverContent>
      </Popover>

      <Button className="w-full sm:w-auto" disabled={isPending}>
        <Link href="/courses/new">Add course</Link>
      </Button>
    </div>
  );
}
