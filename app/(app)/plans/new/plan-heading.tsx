"use client";

import { differenceInCalendarDays, format, startOfDay } from "date-fns";
import { DatePickerField } from "./date-picker";

function getRelativeDayLabel(date: Date) {
  const diff = differenceInCalendarDays(
    startOfDay(date),
    startOfDay(new Date()),
  );
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";
  return format(date, "EEEE"); // e.g. "Friday" for anything further out
}

export function PlanHeading({
  date,
  onDateChange,
}: {
  date: Date;
  onDateChange: (date: Date) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Create a plan for {getRelativeDayLabel(date)}{" "}
        <span className="font-normal text-muted-foreground">
          ({format(date, "d MMMM yyyy")})
        </span>
      </h1>
      <DatePickerField date={date} onDateChange={onDateChange} />
    </div>
  );
}
