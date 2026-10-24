
import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().trim().min(2, "Job title must be at least 2 characters").max(150),

  description: z.string().trim().min(20, "Job description must be at least 20 characters"),

  requiredSkills: z
    .array(z.string().trim().min(1).max(100))
    .default([]),

  preferredSkills: z
    .array(z.string().trim().min(1).max(100))
    .default([]),

  minExperienceYears: z
    .number()
    .int()
    .min(0)
    .max(60)
    .nullable()
    .optional(),
}).strict();

export type CreateJobInput = z.infer<typeof createJobSchema>;
