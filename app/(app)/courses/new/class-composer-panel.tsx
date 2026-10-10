"use client";

import { ClassInput, DAY_OF_WEEK_LABELS, dayOfWeekEnum } from "@/schema/course";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type ClassDraft = {
  day: ClassInput["day"];
  roomNo: string;
  startsAt: string;
  endsAt: string;
};

type ClassComposerPanelProps = {
  draft: ClassDraft;
  errors: Partial<Record<"day" | "startsAt" | "endsAt" | "roomNo", string>>;
  onChange: (patch: Partial<ClassDraft>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  variant?: "side" | "sheet";
};

export function ClassComposerPanel({
  draft,
  errors,
  onChange,
  onClose,
  onSubmit,
  variant = "side",
}: ClassComposerPanelProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col">
      <div
        className={cn(
          "flex items-center justify-between",
          variant === "side" ? "px-5 py-4" : "px-4 py-2",
        )}
      >
        <h3 className="text-sm font-semibold text-foreground">Add class</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-5 overflow-y-auto",
          variant === "side" ? "px-5 pb-8" : "px-4 pb-6",
        )}
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Day</label>
          <Select
            value={draft.day}
            onValueChange={(v) => onChange({ day: v as ClassInput["day"] })}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dayOfWeekEnum.options.map((value) => (
                <SelectItem key={value} value={value}>
                  {DAY_OF_WEEK_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.day && (
            <p className="text-xs text-destructive">{errors.day}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Starts at
          </label>
          <input
            type="time"
            value={draft.startsAt}
            onChange={(e) => onChange({ startsAt: e.target.value })}
            className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {errors.startsAt && (
            <p className="text-xs text-destructive">{errors.startsAt}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Ends at</label>
          <input
            type="time"
            value={draft.endsAt}
            onChange={(e) => onChange({ endsAt: e.target.value })}
            className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {errors.endsAt && (
            <p className="text-xs text-destructive">{errors.endsAt}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Room</label>
          <input
            value={draft.roomNo}
            onChange={(e) => onChange({ roomNo: e.target.value })}
            placeholder="e.g. Room 301"
            className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>

      <div
        className={cn(
          "flex shrink-0 gap-2 border-t border-border",
          variant === "side" ? "px-5 py-4" : "px-4 py-3",
        )}
      >
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-background"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={!draft.startsAt}>
          Add class
        </Button>
      </div>
    </form>
  );
}
