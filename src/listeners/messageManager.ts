import { ISocket } from '@src/routes/types/types';

const sendMessage = (socket: ISocket) => () => {
  socket.emit('message:receive', { body: 'test message' });
};

export default { sendMessage } as const;
