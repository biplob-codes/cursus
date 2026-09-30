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

/**
 * Parse "yyyy-MM-dd" (or a longer ISO string starting with that) into a
 * date-only value at UTC noon. Used by Zod schemas and any form input.
 */
export function parseDateOnly(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) {
    throw new Error("Invalid date");
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

/** yyyy-MM-dd for a date-only value (reads UTC parts). */
export function toDateString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Local calendar Date from a date-only (UTC noon) value so date-fns
 * format / startOfDay stay on the intended calendar day.
 */
function localFromDateOnly(date: Date): Date {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
}

/**
 * Format a plan date for display without timezone shift.
 * Builds a local Date from UTC Y/M/D so date-fns format stays on the same calendar day.
 */
export function formatDateOnly(date: Date, pattern = "d MMMM yyyy"): string {
  return format(localFromDateOnly(date), pattern);
}

/**
 * Relative label for a date-only value: today / tomorrow / yesterday / weekday.
 * Compares calendar days in local time after lifting UTC Y/M/D.
 */
export function getRelativeDayLabel(date: Date): string {
  const local = localFromDateOnly(date);
  const diff = differenceInCalendarDays(startOfDay(local), startOfDay(new Date()));
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";
  return format(local, "EEEE");
}

/**
 * Within the last 7 days → relative ("3 days ago").
 * Older → absolute calendar date ("23 Sep 2025").
 * Intended for timestamps (createdAt / updatedAt), not @db.Date fields.
 */
export function formatUpdatedAt(date: Date): string {
  const days = differenceInDays(new Date(), date);
  if (days < 7) {
    return formatDistanceToNowStrict(date, { addSuffix: true });
  }
  return format(date, "d MMM yyyy");
}
