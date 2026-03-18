import { z } from "zod";

export const waitlistSchema = z.object({
  company: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160)
});

export type WaitlistPayload = z.infer<typeof waitlistSchema>;

