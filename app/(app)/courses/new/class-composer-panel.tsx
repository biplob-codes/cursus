"use client";

import { ClassInput, DAY_OF_WEEK_LABELS, dayOfWeekEnum } from "@/schema/course";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { TimePicker } from "@/components/time-picker";
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
  variant?: "side" | "sheet";
};

export function ClassComposerPanel({
  draft,
  errors,
  onChange,
  onClose,
  variant = "side",
}: ClassComposerPanelProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col bg-muted/40",
        variant === "side" && "border-l border-border",
        variant === "sheet" && "min-h-0 rounded-t-2xl",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-end",
          variant === "side" ? "px-6 py-4" : "px-4 py-2",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      {/* Body */}
      <div
        className={cn(
          "flex flex-1 flex-col gap-7 overflow-y-auto pb-10",
          variant === "side" ? "px-6" : "px-4",
        )}
      >
        {/* Day */}
        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-foreground">Day</label>
          <Select
            value={draft.day}
            onValueChange={(v) => onChange({ day: v as ClassInput["day"] })}
            items={dayOfWeekEnum.options.map((value) => ({
              value,
              label: DAY_OF_WEEK_LABELS[value],
            }))}
          >
            <SelectTrigger className="h-9 w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-[160px] py-1">
              {dayOfWeekEnum.options.map((value) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="py-1.5 pl-2 pr-8 text-sm"
                >
                  {DAY_OF_WEEK_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.day && (
            <p className="text-xs text-destructive">{errors.day}</p>
          )}
        </div>

        {/* Starts at */}
        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-foreground">
            Starts at
          </label>
          <TimePicker
            value={draft.startsAt}
            onChange={(value) => onChange({ startsAt: value })}
            placeholder="Select time"
          />
          {errors.startsAt && (
            <p className="text-xs text-destructive">{errors.startsAt}</p>
          )}
        </div>

        {/* Room */}
        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-foreground">Room</label>
          <input
            value={draft.roomNo}
            onChange={(e) => onChange({ roomNo: e.target.value })}
            placeholder="e.g. Room 301"
            className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>
    </aside>
  );
}
