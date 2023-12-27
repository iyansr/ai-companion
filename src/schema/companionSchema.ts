import { z } from "zod";

export const companionSchema = z.object({
  name: z.string().min(1),
  imageSrc: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  instructions: z.string().min(200),
  seed: z.string().min(200),
});

export type CompanionSchema = z.infer<typeof companionSchema>;
