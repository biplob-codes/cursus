import { z } from "zod";
import { parseDateOnly } from "@/lib/date";
import { taskInputSchema } from "./task";

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
