import { z } from 'zod';

export const profilePatchSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

export type ProfilePatch = z.infer<typeof profilePatchSchema>;
