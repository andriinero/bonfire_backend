import { MessageType } from '@prisma/client';
import type { ISocket } from '@src/routes/types/types';
import logger from 'jet-logger';
import { v4 as uuidv4 } from 'uuid';

type ReceivedMessage = {
  chatRoomId: string;
  body: string;
  reply?: string;
};

const sendMessage = (socket: ISocket) => (message: ReceivedMessage) => {
  const userId = socket.request.user!.id;
  // FIXME: REMOVE
  logger.info(`${userId.toString()} has sent message: '${message.body}'`);
  socket.emit('message:receive', {
    _id: uuidv4(),
    user: userId,
    type: MessageType.MESSAGE,
    created: new Date(),
    chat_room: message.chatRoomId,
    body: message.body,
  });
};

export default { sendMessage } as const;
