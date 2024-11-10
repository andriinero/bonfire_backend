import type { ISocket } from '@src/routes/types/types';

import messageManager from './messageManager';

import ProfileService from '@src/services/ProfileService';

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

export default { onConnection } as const;
