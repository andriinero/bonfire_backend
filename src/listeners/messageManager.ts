import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import {
  ReceivedUserMessage,
  ReceivedUserMessageSchema,
} from '@src/routes/schemas/MessageSchemas';
import type { ISocket } from '@src/routes/types/types';
import MessageService from '@src/services/MessageService';
import { handleSocketError } from './socketManager';

const sendMessage =
  (socket: ISocket) => async (message: ReceivedUserMessage) => {
    try {
      ReceivedUserMessageSchema.parse(message);

      const userId = socket.request.user!.id;
      const { chatRoomId, body } = message;

      const createdMessage = await MessageService.createUserMessage({
        chatRoomId,
        userId,
        body,
      });

      socket.emit('message:receive', createdMessage);
    } catch (err) {
      handleSocketError(socket, HttpStatusCodes.BAD_REQUEST, err);
    }
  };

export default { sendMessage } as const;
