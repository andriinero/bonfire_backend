import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { MessageType, TMessage } from '@src/models/Message';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import MessageRepo, { TUpdateMessage } from '@src/repos/MessageRepo';
import { TQueryOptions } from '@src/types/TQueryOptions';
import { CHAT_ROOM_NOT_FOUND_ERR } from './ChatRoomService';

type TCreateUserMessage = Omit<TMessage, '_id' | 'created' | 'type'>;

type TCreateActionMessage = Omit<
  TMessage,
  '_id' | 'created' | 'user' | 'reply' | 'type'
>;

export const MESSAGE_NOT_FOUND_ERR = 'Message not found';

const getAllByChatRoomId = async (
  chatRoomId: string,
  query: TQueryOptions<TMessage>,
): Promise<TMessage[]> => {
  const persists = await ChatRoomRepo.persists({ _id: chatRoomId });
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);
  }

  const messages = await MessageRepo.getAll(
    { chat_room: chatRoomId },
    { ...query, sort: { created: -1 } },
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

const createUserMessage = async (
  data: TCreateUserMessage,
): Promise<TMessage> => {
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

const createActionMessage = async (
  data: TCreateActionMessage,
): Promise<TMessage> => {
  const messageDetails = {
    ...data,
    created: new Date(),
    type: MessageType.ACTION,
  };
  const createdMessage = await MessageRepo.createOne(messageDetails);

  return createdMessage;
};

const getPageCountByChatRoomId = async (
  chatRoomId: string,
): Promise<number> => {
  const docCount = await MessageRepo.getCount({ chat_room: chatRoomId });

  return Math.floor(docCount / EnvVars.Bandwidth.maxDocsPerFetch);
};

export default {
  getAllByChatRoomId,
  getOneById,
  createUserMessage,
  createActionMessage,
  updateOneById,
  deleteOneById,
  getPageCountByChatRoomId,
} as const;
