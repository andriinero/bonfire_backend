import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TChatRoom } from '@src/models/ChatRoom';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo, {
  TChatRoomMutableData,
  TChatRoomQuery,
} from '@src/repos/ChatRoomRepo';
import UserRepo from '@src/repos/UserRepo';
import { Types } from 'mongoose';
import { USER_NOT_FOUND_ERR } from './UserService';

type TCreateChatRoomData = {
  name: string;
  participants: Types.ObjectId[];
};

export const CHAT_ROOM_NOT_FOUND_ERR = 'Chat room not found';

const getAllByUserId = async (userId: Types.ObjectId): Promise<TChatRoom[]> => {
  const allChatRooms = await ChatRoomRepo.getAll({ participants: userId });

  return allChatRooms;
};

const getOneById = async (query: TChatRoomQuery): Promise<TChatRoom> => {
  const foundChatRoom = await ChatRoomRepo.getOne(query);
  if (!foundChatRoom) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);
  }

  return foundChatRoom;
};

const createOne = async (postData: TCreateChatRoomData): Promise<void> => {
  const users = await Promise.all(
    postData.participants.map((p) => UserRepo.getOne({ _id: p })),
  );

  const persists = users.every((p) => !!p);

  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  const chatRoomDetails = {
    ...postData,
    date: new Date(),
  };

  return ChatRoomRepo.createOne(chatRoomDetails);
};

const updateOneById = async (
  query: TChatRoomQuery,
  data: TChatRoomMutableData,
): Promise<void> => {
  const persists = await ChatRoomRepo.persists(query);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);
  }

  return ChatRoomRepo.updateOne(query, data);
};

export default {
  getAll: getAllByUserId,
  getOneById,
  createOne,
  updateOneById,
};
