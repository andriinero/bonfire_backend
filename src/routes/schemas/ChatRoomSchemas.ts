import ContactRepo from '@src/repos/ContactRepo';
import { z } from 'zod';

const nameBodySchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).max(100),
  }),
});

const hasContactsWithIds = z
  .object({
    user: z.object({ id: z.any() }),
    body: z.object({
      userIds: z.string().array(),
    }),
  })
  .refine(async (req) => {
    const currentUserId = req.user.id;
    const userWithContacts = await ContactRepo.hasContactsWithIds(
      currentUserId,
      req.body.userIds,
    );
    return !!userWithContacts;
  }, 'Contacts not found');

export default {
  nameBodySchema,
  hasContactsWithIds,
} as const;
