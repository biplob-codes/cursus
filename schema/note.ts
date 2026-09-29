import { z } from "zod";

export const tagNameSchema = z
  .string()
  .trim()
  .min(1, "Tag name is required")
  .max(40, "Keep tag names under 40 characters")
  .regex(
    /^[\w\s-]+$/u,
    "Tags can only contain letters, numbers, spaces, hyphens, and underscores",
  );

export const createTagSchema = z.object({
  name: tagNameSchema,
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give the note a title")
    .max(200, "Keep the title under 200 characters"),
  description: z
    .string()
    .trim()
    .max(100_000, "Description is too long")
    .optional()
    .transform((value) =>
      value === "" || value === undefined ? undefined : value,
    ),
  /** Existing tag ids owned by the user */
  tagIds: z.array(z.string().uuid()).default([]),
  /** New tag names to create and attach */
  newTagNames: z.array(tagNameSchema).default([]),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
