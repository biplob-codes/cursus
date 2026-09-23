import { z } from "zod";

export const taskStatusValues = ["TODO", "IN_PROGRESS", "DONE"] as const;
export const taskPriorityValues = ["LOW", "MEDIUM", "HIGH"] as const;

export const taskStatusEnum = z.enum(taskStatusValues);
export const taskPriorityEnum = z.enum(taskPriorityValues);

// No planId here on purpose — a task is only ever created as part of a
// plan submission, so the id gets assigned server-side after the plan exists.
export const taskInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give the task a title")
    .max(200, "Keep the title under 200 characters"),
  description: z
    .string()
    .trim()
    .max(2000, "Keep the description under 2000 characters")
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  status: taskStatusEnum.default("TODO"),
  priority: taskPriorityEnum.default("MEDIUM"),
});

export type TaskInput = z.infer<typeof taskInputSchema>;
