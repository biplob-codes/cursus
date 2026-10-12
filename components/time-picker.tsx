"use client";

import { useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { cn } from "@/lib/utils";

type TimePickerProps = {
  value: string; // "HH:mm" 24h or empty
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function parseValue(value: string): {
  hour12: number;
  minute: number;
  period: "AM" | "PM";
} {
  if (!value || !value.includes(":")) {
    return { hour12: 9, minute: 0, period: "AM" };
  }

  const [hStr, mStr] = value.split(":");
  const hour24 = parseInt(hStr, 10);
  const minute = parseInt(mStr, 10) || 0;

  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  return { hour12, minute, period };
}

function to24Hour(hour12: number, minute: number, period: "AM" | "PM"): string {
  let hour24 = hour12 % 12;
  if (period === "PM") hour24 += 12;

  const h = String(hour24).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  return `${h}:${m}`;
}

function formatDisplay(value: string): string {
  if (!value) return "";
  const { hour12, minute, period } = parseValue(value);
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  className,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);

  const { hour12, minute, period } = useMemo(() => parseValue(value), [value]);

  function update(
    nextHour12: number,
    nextMinute: number,
    nextPeriod: "AM" | "PM",
    shouldClose = false,
  ) {
    onChange(to24Hour(nextHour12, nextMinute, nextPeriod));
    if (shouldClose) {
      setOpen(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors",
          "hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          !value && "text-muted-foreground",
          className,
        )}
      >
        <span className="truncate">
          {value ? formatDisplay(value) : placeholder}
        </span>
        <Clock className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent align="start" sideOffset={6} className="w-auto p-2">
        <div className="flex gap-1">
          {/* Hours – keep open */}
          <div className="grid grid-cols-3 gap-0.5">
            {HOURS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => update(h, minute, period)}
                className={cn(
                  "flex h-8 w-9 items-center justify-center rounded-md text-sm tabular-nums transition-colors",
                  h === hour12
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {h}
              </button>
            ))}
          </div>

          <div className="w-px self-stretch bg-border" />

          {/* Minutes – keep open */}
          <div className="grid grid-cols-3 gap-0.5">
            {MINUTES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update(hour12, m, period)}
                className={cn(
                  "flex h-8 w-9 items-center justify-center rounded-md text-sm tabular-nums transition-colors",
                  m === minute
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {String(m).padStart(2, "0")}
              </button>
            ))}
          </div>

          <div className="w-px self-stretch bg-border" />

          {/* AM / PM – close after selection */}
          <div className="flex flex-col gap-0.5">
            {(["AM", "PM"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => update(hour12, minute, p, true)}
                className={cn(
                  "flex h-8 w-10 items-center justify-center rounded-md text-sm transition-colors",
                  p === period
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
