import { z } from 'zod';

export const profilePatchSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  location: z.string(),
  bio: z.string(),
});

export type ProfilePatch = z.infer<typeof profilePatchSchema>;
