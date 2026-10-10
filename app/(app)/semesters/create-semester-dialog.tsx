"use client";

import { useActionState, useEffect, useState } from "react";
import { createSemester } from "@/actions/semester";
import { initialActionState } from "@/actions/action-state";
import { SEMESTER_NAME_LABELS } from "@/schema/semester";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { cn } from "@/lib/utils";

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full sm:w-auto" />}>
        Create semester
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Create semester</DialogTitle>
          <DialogDescription>
            Add a new semester to organize your courses.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="semester-name"
              className="text-sm font-medium text-foreground"
            >
              Name
            </label>
            <Select
              value={name}
              onValueChange={(value) => setName(value as string)}
            >
              <SelectTrigger id="semester-name" className="w-full">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent className="p-1">
                {(
                  Object.entries(SEMESTER_NAME_LABELS) as [
                    keyof typeof SEMESTER_NAME_LABELS,
                    string,
                  ][]
                ).map(([value, label]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="cursor-pointer px-2.5 py-2"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="name" value={name} />
            {state.errors?.name?.[0] && (
              <p className="text-xs text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          {/* Year */}
          <div className="flex flex-col gap-2">
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
              className={cn(
                "[appearance:textfield]",
                "[&::-webkit-outer-spin-button]:appearance-none",
                "[&::-webkit-inner-spin-button]:appearance-none",
              )}
            />
            {state.errors?.year?.[0] && (
              <p className="text-xs text-destructive">{state.errors.year[0]}</p>
            )}
          </div>

          {state.status === "error" && state.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <div className="gap-2 flex items-center justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name}>
              {isPending ? "Creating…" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
