import { z } from "zod";

export const dayOfWeekEnum = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);

export const DAY_OF_WEEK_LABELS: Record<
  z.infer<typeof dayOfWeekEnum>,
  string
> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const classInputSchema = z.object({
  day: dayOfWeekEnum,
  roomNo: z
    .string()
    .trim()
    .max(40, "Keep the room under 40 characters")
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  startsAt: z.string().trim().regex(timeRegex, "Use HH:mm format (e.g. 09:30)"),
  endsAt: z
    .union([
      z.string().trim().regex(timeRegex, "Use HH:mm format (e.g. 10:50)"),
      z.literal(""),
    ])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
});

export type ClassInput = z.infer<typeof classInputSchema>;

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
  classes: z.array(classInputSchema).default([]),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema
  .omit({ classes: true })
  .extend({
    id: z.string().uuid(),
  });

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

export const createClassSchema = classInputSchema.extend({
  courseId: z.string().uuid(),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
