import * as z from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(50, "Project name must be less than 50 characters"),
  key: z
    .string()
    .min(1, "Project key is required")
    .max(10, "Project key must be less than 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Project key must be uppercase letters and numbers only"
    ),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

export const sprintSchema = z.object({
  name: z.string().min(2, {
    message: "Sprint name must be at least 2 characters.",
  }),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});
