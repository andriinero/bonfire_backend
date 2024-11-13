import { MessageType } from '@prisma/client';
import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import MessageRepo, { UpdateMessageData } from '@src/repos/MessageRepo';
import type { QueryOptions } from '@src/types/QueryOptions';
import { CHAT_ROOM_NOT_FOUND_ERR } from './ChatRoomService';

export const MESSAGE_NOT_FOUND_ERR = 'Message not found';

const getAllByChatRoomId = async (
  chatRoomId: string,
  queryOpts: QueryOptions,
) => {
  const persists = await ChatRoomRepo.persists({ id: chatRoomId });
  if (!persists)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);

  const messages = await MessageRepo.getAll({ chatRoomId }, queryOpts, {
    created: 'desc',
  });

  return messages;
};

const getOneById = async (id: string) => {
  const message = await MessageRepo.getOne({ id });
  if (!message)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, MESSAGE_NOT_FOUND_ERR);

  return message;
};

const createUserMessage = async (data: {
  userId: string;
  chatRoomId: string;
  body: string;
}) => {
  const { userId, chatRoomId, body } = data;

  const messageData = {
    user: { connect: { id: userId } },
    chatroom: { connect: { id: chatRoomId } },
    body,
    type: MessageType.MESSAGE,
  };

  const createdMessage = await MessageRepo.createOne(messageData);

  return createdMessage;
};

const createActionMessage = async (data: {
  chatRoomId: string;
  body: string;
}) => {
  const { chatRoomId, body } = data;

  const messageDetails = {
    chatroom: { connect: { id: chatRoomId } },
    body,
    type: MessageType.ACTION,
  };

  const createdMessage = await MessageRepo.createOne(messageDetails);

  return createdMessage;
};

const updateOneById = async (id: string, data: UpdateMessageData) => {
  await MessageRepo.updateOne({ id }, data);
};

const deleteOneById = async (id: string) => {
  await MessageRepo.deleteOne({ id });
};

const getPageCountByChatRoomId = async (chatRoomId: string) => {
  const docCount = await MessageRepo.getCount({ chatRoomId });

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
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
