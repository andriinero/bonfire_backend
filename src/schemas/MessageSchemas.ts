import { z } from 'zod';

export const ReceivedUserMessageSchema = z.object({
  chatRoomId: z.string(),
  body: z.string(),
  reply: z.string().optional(),
});

export type ReceivedUserMessage = z.infer<typeof ReceivedUserMessageSchema>;
