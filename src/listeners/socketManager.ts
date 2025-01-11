import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { ISocket } from '@src/routes/types/types';
import ProfileService from '@src/services/profile/ProfileService';
import { ZodError } from 'zod';
import { fromError } from 'zod-validation-error';
import messageManager from './messageManager';

export type SocketError = { status: HttpStatusCodes; data: { error: string } };

const onConnection = (socket: ISocket) => {
  logConnectedUser(socket);

  socket.on('disconnect', logDisconnectedUser(socket));

  socket.on('message:send', messageManager.sendMessage(socket));
};

const logConnectedUser = async (socket: ISocket) => {
  const user = socket.request.user!;
  await ProfileService.updateOnlineStatus(user.id, true);
};

const logDisconnectedUser = (socket: ISocket) => async () => {
  const user = socket.request.user!;
  await ProfileService.updateOnlineStatus(user.id, false);
};

export const handleSocketError = (
  socket: ISocket,
  status: HttpStatusCodes,
  error: unknown,
) => {
  let errorMessage = 'Socket returned an error';
  let statusCode = HttpStatusCodes.BAD_GATEWAY;
  if (error instanceof ZodError) {
    const validationError = fromError(error);
    errorMessage = validationError.toString();
    statusCode = status;
  }

  socket.emit('error:receive', {
    statusCode,
    data: { error: errorMessage },
  });
};

export default { onConnection } as const;
