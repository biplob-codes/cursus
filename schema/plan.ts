import { z } from "zod";
import { taskInputSchema } from "./task";

// The whole page submits as one payload: plan fields plus every draft
// task the user built up client-side. The server creates both in one
// transaction — see lib/actions/plan.ts.
export const createPlanWithTasksSchema = z.object({
  date: z
    .string()
    .min(1, "Pick a date")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Pick a valid date")
    .transform((value) => new Date(value)),
  note: z
    .string()
    .trim()
    .max(500, "Keep the note under 500 characters")
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  tasks: z.array(taskInputSchema).default([]),
});

export type CreatePlanWithTasksInput = z.infer<
  typeof createPlanWithTasksSchema
>;
