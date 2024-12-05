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

      const { id: messageId } = await MessageService.createUserMessage({
        chatRoomId,
        userId,
        body,
      });
      const createdMessage = await MessageService.getOneById(messageId);

      socket.emit('message:receive', createdMessage);
    } catch (err) {
      handleSocketError(socket, HttpStatusCodes.BAD_REQUEST, err);
    }
  };

export default { sendMessage } as const;
