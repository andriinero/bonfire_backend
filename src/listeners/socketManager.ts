import { ISocket } from '@src/routes/types/types';
import ProfileService from '@src/services/ProfileService';
import logger from 'jet-logger';

const onConnection = (socket: ISocket) => {
  socketInit(socket);

  socket.on('disconnect', onDisconnect(socket));
};

const socketInit = async (socket: ISocket) => {
  const user = socket.request.user!;
  await ProfileService.updateOnlineStatus(user._id, true);
  logger.info(
    `[${new Date().toString()}] Client with user id ${user?.id} connected`,
  );
};

const onDisconnect = (socket: ISocket) => async () => {
  const user = socket.request.user!;

  await ProfileService.updateOnlineStatus(user._id, false);
  logger.info(
    `[${new Date().toString()}] Client with user id ${user?.id} disconnected`,
  );
};

export default { onConnection } as const;
