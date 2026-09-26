import { z } from "zod";
import { taskInputSchema } from "./task";

function parseDateOnly(value: string): Date {
  // Accept "yyyy-MM-dd" or a full ISO string; always keep the calendar day.
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) {
    throw new Error("Invalid date");
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  // UTC noon avoids DST edge cases; @db.Date stores the calendar date only.
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

export const createPlanWithTasksSchema = z.object({
  date: z
    .string()
    .min(1, "Pick a date")
    .refine((value) => /^\d{4}-\d{2}-\d{2}/.test(value), "Pick a valid date")
    .transform((value) => parseDateOnly(value)),
  note: z
    .string()
    .trim()
    .max(500, "Keep the note under 500 characters")
    .nullable()
    .optional()
    .transform((value) => (value === "" || value === null ? undefined : value)),
  tasks: z.array(taskInputSchema).default([]),
});

export type CreatePlanWithTasksInput = z.infer<
  typeof createPlanWithTasksSchema
>;
