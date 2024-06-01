import { ISocket } from '@src/routes/types/types';
import ProfileService from '@src/services/ProfileService';
import logger from 'jet-logger';
import messageManager from './messageManager';

const onConnection = (socket: ISocket) => {
  logConnectedUser(socket);

  socket.on('disconnect', logDisconnectedUser(socket));

  socket.on('message:send', messageManager.sendMessage(socket));
};

const logConnectedUser = async (socket: ISocket) => {
  const user = socket.request.user!;
  await ProfileService.updateOnlineStatus(user._id, true);
  logger.info(
    `[${new Date().toString()}] Client with user id ${user?.id} connected`,
  );
};

const logDisconnectedUser = (socket: ISocket) => async () => {
  const user = socket.request.user!;
  await ProfileService.updateOnlineStatus(user._id, false);
  logger.info(
    `[${new Date().toString()}] Client with user id ${user?.id} disconnected`,
  );
};

export default { onConnection } as const;
