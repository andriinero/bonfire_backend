import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    chatroomid: z.string().trim().refine(isValidObjectId, {
      message: 'Invalid chat room id',
    }),
  }),
});

const nameBodySchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).max(100),
  }),
});

const usernameOwnership = (fieldName: string) =>
  z
    .object({
      user: z.object({ username: z.string() }),
      body: z.object({
        [fieldName]: z.string().trim(),
      }),
    })
    .refine(({ body, user: { username } }) => username !== body[fieldName], {
      message: "You can't select yourself",
    });

const userIdBodySchema = z.object({
  body: z.object({
    userid: z
      .string()
      .trim()
      .refine(isValidObjectId, { message: 'Invalid user id' }),
  }),
});

const body = { nameBodySchema, userIdBodySchema };

const params = { idParamSchema };

const sanitizers = { usernameOwnership };

export default {
  body,
  params,
  sanitizers,
} as const;
