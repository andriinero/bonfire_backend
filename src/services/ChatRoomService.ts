import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import {
  TChatRoom,
  TChatRoomMutable,
  TChatRoomPost,
} from '@src/models/ChatRoom';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import UserRepo from '@src/repos/UserRepo';
import { Types } from 'mongoose';
import { USER_NOT_FOUND_ERR } from './UserService';

export type TChatQuery = {
  _id: Types.ObjectId;
  participants: string;
};

export type TChatQueryDetailed = {
  limit: number;
  skip: number;
} & TChatQuery;

export const CHAT_ROOM_NOT_FOUND_ERR = 'Chat room not found';

const getAll = async (userId: string): Promise<TChatRoom[]> => {
  const allChatRooms = await ChatRoomRepo.getAll({ participants: userId });

  return allChatRooms;
};

const getOneById = async (query: TChatQuery): Promise<TChatRoom> => {
  const foundChatRoom = await ChatRoomRepo.getOne(query);
  if (!foundChatRoom) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);
  }

  return foundChatRoom;
};

const createOne = async (postData: TChatRoomPost): Promise<void> => {
  const persists = await UserRepo.persists(postData.participant);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  return ChatRoomRepo.createOne(postData);
};

const updateOneById = async (
  query: TChatQuery,
  data: TChatRoomMutable,
): Promise<void> => {
  const persists = await ChatRoomRepo.persists(query);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);
  }

  return ChatRoomRepo.updateOne(query, data);
};

export default {
  getAll,
  getOneById,
  createOne,
  updateOneById,
};
