import type { ISocket } from '@src/routes/types/types';
import MessageService from '@src/services/MessageService';

type ReceivedMessage = {
  chatRoomId: string;
  body: string;
  reply?: string;
};

const sendMessage = (socket: ISocket) => async (message: ReceivedMessage) => {
  const userId = socket.request.user!.id;
  const { chatRoomId, body } = message;

  const createdMessage = await MessageService.createUserMessage({
    chatRoomId,
    userId,
    body,
  });

  socket.emit('message:receive', createdMessage);
};

export default { sendMessage } as const;
