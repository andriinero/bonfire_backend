import { Types } from 'mongoose';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TChatRoom } from '@src/models/ChatRoom';
import { RouteError } from '@src/other/classes';
import { getRandomColorClass } from '@src/util/getRandomColorClass';

import { TQueryOptions } from '@src/types/TQueryOptions';

import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import UserRepo from '@src/repos/UserRepo';

import { USER_NOT_FOUND_ERR } from './AuthService';
import MessageService from './MessageService';

type TChatRoomQuery = {
  userId: Types.ObjectId | string;
  roomId: Types.ObjectId | string;
};

export const CHAT_ROOM_NOT_FOUND_ERR = 'Chat room not found';

const getByUserId = async (
  userId: Types.ObjectId | string,
  query?: TQueryOptions<TChatRoom>,
) => {
  const allChatRooms = await ChatRoomRepo.getAll(
    { participants: userId },
    query,
  );

  return allChatRooms;
};

const getById = async ({ roomId, userId }: TChatRoomQuery) => {
  const foundChatRoom = await ChatRoomRepo.getOne({
    _id: roomId,
    participants: userId,
  });
  if (!foundChatRoom)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);

  return foundChatRoom;
};

const createOne = async (
  currentUserUserId: Types.ObjectId | string,
  participantUsername: string,
) => {
  const participant = await UserRepo.getOne({ username: participantUsername });
  if (!participant)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  const chatRoomDetails = {
    participants: [currentUserUserId, participant._id],
    created: new Date(),
    color_class: getRandomColorClass(),
  };
  const createdChatRoomId = await ChatRoomRepo.createOne(chatRoomDetails);

  await MessageService.createActionMessage({
    chat_room: createdChatRoomId,
    body: 'chat room created',
  });
};

const getPageCount = async (userId: Types.ObjectId | string) => {
  const docCount = await ChatRoomRepo.getCount({ participants: userId });

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  getByUserId,
  getById,
  createOne,
  getPageCount,
} as const;
