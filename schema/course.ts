import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give the course a title")
    .max(200, "Keep the title under 200 characters"),
  courseCode: z
    .string()
    .trim()
    .min(1, "Course code is required")
    .max(40, "Keep the course code under 40 characters"),
  credit: z.coerce
    .number({ error: "Enter a valid credit value" })
    .positive("Credit must be greater than 0")
    .max(30, "Credit seems too high"),
  gradePoint: z
    .union([
      z.coerce
        .number()
        .min(0, "Grade point cannot be negative")
        .max(4, "Grade point cannot exceed 4"),
      z.literal(""),
      z.null(),
    ])
    .optional()
    .transform((value) =>
      value === "" || value === null || value === undefined ? undefined : value,
    ),
  teacher: z
    .string()
    .trim()
    .max(120, "Keep the teacher name under 120 characters")
    .optional()
    .transform((value) =>
      value === "" || value === undefined ? undefined : value,
    ),
  semesterId: z.string().uuid("Pick a semester"),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
