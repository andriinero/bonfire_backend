import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { ISocket } from '@src/routes/types/types';
import ProfileService from '@src/services/ProfileService';
import messageManager from './messageManager';

export type SocketError = { status: HttpStatusCodes; data: { error: string } };

const onConnection = (socket: ISocket) => {
  logConnectedUser(socket);

  socket.on('disconnect', logDisconnectedUser(socket));

  socket.on('message:send', messageManager.sendMessage(socket));
};

const logConnectedUser = async (socket: ISocket) => {
  const user = socket.request.user!;
  // FIXME: remove console.log()
  console.log('connected ' + socket.id);
  await ProfileService.updateOnlineStatus(user.id, true);
};

const logDisconnectedUser = (socket: ISocket) => async () => {
  const user = socket.request.user!;
  await ProfileService.updateOnlineStatus(user.id, false);
};

export const handleSocketError = (
  socket: ISocket,
  status: HttpStatusCodes,
  error: string,
) => {
  socket.emit('error:receive', {
    status,
    data: { error },
  });
};

export default { onConnection } as const;
