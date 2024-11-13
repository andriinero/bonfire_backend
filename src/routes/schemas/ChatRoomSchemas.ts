import { z } from 'zod';

import ContactRepo from '@src/repos/ContactRepo';

const idParamSchema = z.object({
  params: z.object({
    chatroomid: z.string().trim(),
  }),
});

const nameBodySchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).max(100),
  }),
});

const userIdBodySchema = z.object({
  body: z.object({
    userid: z.string().trim(),
  }),
});

const contactIdsExistence = z
  .object({
    user: z.object({ _id: z.any() }),
    body: z.object({
      userIds: z.string().array(),
    }),
  })
  .refine(async (req) => {
    const currentUserId = req.user._id.toString();
    const userWithContacts = await ContactRepo.hasContactsWithIds(
      currentUserId,
      req.body.userIds,
    );
    return !!userWithContacts;
  }, 'Contacts not found');

const body = { nameBodySchema, userIdBodySchema, contactIdsExistence };

const params = { idParamSchema };

export default {
  body,
  params,
} as const;
