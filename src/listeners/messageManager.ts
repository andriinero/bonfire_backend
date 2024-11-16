import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { ISocket } from '@src/routes/types/types';
import { ReceivedUserMessage } from '@src/schemas/MessageSchemas';
import MessageService from '@src/services/MessageService';

const sendMessage =
  (socket: ISocket) => async (message: ReceivedUserMessage) => {
    // try {
    //   const result = ReceivedUserMessageSchema.safeParse(message);
    //   if (!result.success) {
    //     const validationError = fromError(result.error);

    // }

    const userId = socket.request.user!.id;
    const { chatRoomId, body } = message;

    const createdMessage = await MessageService.createUserMessage({
      chatRoomId,
      userId,
      body,
    });

    socket.emit('error:occured', {
      status: HttpStatusCodes.BAD_REQUEST,
      data: { error: 'error has occured' },
    });
    socket.emit('message:receive', createdMessage);
    // } catch (err) {
    //   if (err instanceof ZodError) {
    //     const validationError = fromError(err);
    //
    //     // FIXME: remove console.log()
    //     console.log(validationError.toString());
    //
    //     socket.emit('error:receive', {
    //       status: HttpStatusCodes.BAD_REQUEST,
    //       data: { error: validationError.toString() },
    //     });
    // handleSocketError(
    //   socket,
    //   HttpStatusCodes.BAD_REQUEST,
    //   validationError.toString(),
    // );
    // }
    // }
  };

export default { sendMessage } as const;
