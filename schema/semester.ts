import { z } from "zod";

export const semesterNameEnum = z.enum(["FALL", "SPRING", "SUMMER"]);

export const createSemesterSchema = z.object({
  name: semesterNameEnum,
  year: z.coerce
    .number({ error: "Enter a valid year" })
    .int("Year must be a whole number")
    .min(2000, "Year must be 2000 or later")
    .max(2100, "Year must be 2100 or earlier"),
});

export type CreateSemesterInput = z.infer<typeof createSemesterSchema>;

export const SEMESTER_NAME_LABELS: Record<
  z.infer<typeof semesterNameEnum>,
  string
> = {
  FALL: "Fall",
  SPRING: "Spring",
  SUMMER: "Summer",
};
