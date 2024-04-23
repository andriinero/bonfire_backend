import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { MessageType, TMessage } from '@src/models/Message';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import MessageRepo, { TUpdateMessage } from '@src/repos/MessageRepo';
import { CHAT_ROOM_NOT_FOUND_ERR } from './ChatRoomService';

type TCreateMessageData = Omit<TMessage, '_id' | 'created' | 'type'>;

export const MESSAGE_NOT_FOUND_ERR = 'Message not found';

const getAllByChatRoomId = async (chatRoomId: string): Promise<TMessage[]> => {
  const persists = await ChatRoomRepo.persists({ _id: chatRoomId });
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);
  }

  const messages = await MessageRepo.getAll(
    { chat_room: chatRoomId },
    { sort: { created: -1 } },
  );
  return messages;
};

const getOneById = async (id: string): Promise<TMessage> => {
  const message = await MessageRepo.getOne({ _id: id });
  if (!message) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, MESSAGE_NOT_FOUND_ERR);
  }

  return message;
};

const createOne = async (data: TCreateMessageData): Promise<TMessage> => {
  const messageDetails = {
    ...data,
    created: new Date(),
    type: MessageType.MESSAGE,
  };

  const createdMessage = await MessageRepo.createOne(messageDetails);
  return createdMessage;
};

const updateOneById = async (
  id: string,
  data: TUpdateMessage,
): Promise<void> => {
  await MessageRepo.updateOne({ _id: id }, data);
};

const deleteOneById = async (id: string): Promise<void> => {
  await MessageRepo.deleteOne({ _id: id });
};

export default {
  getAllByChatRoomId,
  getOneById,
  createOne,
  updateOneById,
  deleteOneById,
} as const;
