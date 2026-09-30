// lib/date.ts
import {
  differenceInCalendarDays,
  format,
  startOfDay,
  formatDistanceToNowStrict,
  differenceInDays,
} from "date-fns";

/**
 * Plan.date is @db.Date — a calendar day, not a moment in time.
 * We store/query at UTC noon so the day never shifts across timezones.
 */

/** Local "today" as a date-only Date (UTC noon). */
export function todayDateOnly(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0),
  );
}

/** yyyy-MM-dd for a date-only value (reads UTC parts). */
export function toDateString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Format a plan date for display without timezone shift.
 * Builds a local Date from UTC Y/M/D so date-fns format stays on the same calendar day.
 */
export function formatDateOnly(date: Date, pattern = "d MMMM yyyy"): string {
  const local = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  return format(local, pattern);
}

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

/**
 * Within the last 7 days → relative ("3 days ago").
 * Older → absolute calendar date ("23 Sep 2025").
 */
export function formatUpdatedAt(date: Date): string {
  const days = differenceInDays(new Date(), date);
  if (days < 7) {
    return formatDistanceToNowStrict(date, { addSuffix: true });
  }
  return format(date, "d MMM yyyy");
}
