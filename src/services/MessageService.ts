import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';

import type { TMessage } from '@src/models/Message';
import { MessageType } from '@src/models/Message';
import type { TUpdateMessage } from '@src/repos/MessageRepo';
import type { TQueryOptions } from '@src/types/TQueryOptions';
import type { Types } from 'mongoose';

import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import MessageRepo from '@src/repos/MessageRepo';

import { CHAT_ROOM_NOT_FOUND_ERR } from './ChatRoomService';

export const MESSAGE_NOT_FOUND_ERR = 'Message not found';

const getAllByChatRoomId = async (
  chatRoomId: Types.ObjectId | string,
  query: TQueryOptions<TMessage>,
) => {
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

const getOneById = async (id: Types.ObjectId | string) => {
  const message = await MessageRepo.getOne({ _id: id });
  if (!message) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, MESSAGE_NOT_FOUND_ERR);
  }

  return message;
};

const createUserMessage = async (data: {
  body: string;
  chat_room: Types.ObjectId | string;
}) => {
  const messageDetails = {
    ...data,
    created: new Date(),
    type: MessageType.MESSAGE,
  };

  const createdMessage = await MessageRepo.createOne(messageDetails);

  return createdMessage;
};

const updateOneById = async (
  id: Types.ObjectId | string,
  data: TUpdateMessage,
) => {
  await MessageRepo.updateOne({ _id: id }, data);
};

const deleteOneById = async (id: Types.ObjectId | string) => {
  await MessageRepo.deleteOne({ _id: id });
};

const createActionMessage = async (data: {
  body: string;
  chat_room: Types.ObjectId | string;
}) => {
  const messageDetails = {
    ...data,
    created: new Date(),
    type: MessageType.ACTION,
  };

  const createdMessage = await MessageRepo.createOne(messageDetails);

  return createdMessage;
};

const getPageCountByChatRoomId = async (
  chatRoomId: Types.ObjectId | string,
) => {
  const docCount = await MessageRepo.getCount({ chat_room: chatRoomId });

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
