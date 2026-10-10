"use client";

import { useActionState, useEffect, useState } from "react";

import { initialActionState } from "@/actions/action-state";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { SEMESTER_NAME_LABELS } from "@/schema/semester";
import { createSemester } from "@/actions/semester";

const CURRENT_YEAR = new Date().getFullYear();

export function CreateSemesterDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [year, setYear] = useState(String(CURRENT_YEAR));
  const [state, formAction, isPending] = useActionState(
    createSemester,
    initialActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      setOpen(false);
      setName("");
      setYear(String(CURRENT_YEAR));
    }
  }, [state]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Button className="w-full sm:w-auto" onClick={() => setOpen(true)}>
        Create semester
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-semester-title"
            className={cn(
              "relative z-10 w-full max-w-md rounded-t-2xl border border-border bg-background p-5 shadow-xl",
              "sm:rounded-2xl sm:p-6",
              "animate-in fade-in-0 zoom-in-95 duration-150",
            )}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2
                  id="create-semester-title"
                  className="text-base font-semibold tracking-tight text-foreground"
                >
                  Create semester
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Add a new semester to organize your courses.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              {/* Semester name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="semester-name"
                  className="text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <Select
                  name="name"
                  value={name}
                  onValueChange={(value) => setName(value as string)}
                >
                  <SelectTrigger
                    id="semester-name"
                    className="w-full"
                    aria-invalid={!!state.errors?.name}
                  >
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[var(--anchor-width)]">
                    {(
                      Object.entries(SEMESTER_NAME_LABELS) as [
                        keyof typeof SEMESTER_NAME_LABELS,
                        string,
                      ][]
                    ).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Hidden input so FormData includes the value (Base UI Select may not submit name) */}
                <input type="hidden" name="name" value={name} />
                {state.errors?.name?.[0] && (
                  <p className="text-xs text-destructive">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label
                  htmlFor="semester-year"
                  className="text-sm font-medium text-foreground"
                >
                  Year
                </label>
                <Input
                  id="semester-year"
                  name="year"
                  type="number"
                  min={2000}
                  max={2100}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2026"
                  aria-invalid={!!state.errors?.year}
                />
                {state.errors?.year?.[0] && (
                  <p className="text-xs text-destructive">
                    {state.errors.year[0]}
                  </p>
                )}
              </div>

              {state.status === "error" && state.message && (
                <p className="text-sm text-destructive">{state.message}</p>
              )}

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isPending || !name}
                >
                  {isPending ? "Creating…" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
