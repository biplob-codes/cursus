import { differenceInCalendarDays, startOfDay, format } from "date-fns";

// Shared by the create form and the display views so "tomorrow"/"today"
// always means the same thing everywhere.
export function getRelativeDayLabel(date: Date) {
  const diff = differenceInCalendarDays(
    startOfDay(date),
    startOfDay(new Date()),
  );
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";
  return format(date, "EEEE");
}
