import { MessageType } from '@prisma/client';
import EnvVars from '@src/constants/EnvVars';
import NotFoundError from '@src/other/errors/NotFoundError';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import MessageRepo, { UpdateMessageData } from '@src/repos/MessageRepo';
import type { QueryOptions } from '@src/types/QueryOptions';

const getAllByChatRoomId = async (
  chatRoomId: string,
  queryOpts: QueryOptions,
) => {
  const persists = await ChatRoomRepo.persists({ id: chatRoomId });
  if (!persists) throw new NotFoundError();

  const messages = await MessageRepo.getAll({ chatRoomId }, queryOpts, {
    created: 'desc',
  });

  return messages;
};

const getOneById = async (id: string) => {
  const message = await MessageRepo.getOne({ id });
  if (!message) throw new NotFoundError();

  return message;
};

const createUserMessage = async (data: {
  chatRoomId: string;
  userId: string;
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
  const messageData = {
    chatroom: { connect: { id: chatRoomId } },
    body,
    type: MessageType.ACTION,
  };
  const createdMessage = await MessageRepo.createOne(messageData);

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
