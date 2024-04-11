import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TChatRoom } from '@src/models/ChatRoom';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo, { TChatRoomMutableData } from '@src/repos/ChatRoomRepo';
import UserRepo from '@src/repos/UserRepo';
import { USER_NOT_FOUND_ERR } from './UserService';

type TChatRoomQuery = {
  userId: string;
  roomId: string;
};

type TCreateChatRoomData = {
  name: string;
  participants: string[];
};

export const CHAT_ROOM_NOT_FOUND_ERR = 'Chat room not found';

const getAll = async (userId: string): Promise<TChatRoom[]> => {
  const allChatRooms = await ChatRoomRepo.getAll({ participants: userId });

  return allChatRooms;
};

const getOne = async ({
  roomId,
  userId,
}: TChatRoomQuery): Promise<TChatRoom> => {
  const foundChatRoom = await ChatRoomRepo.getOne({
    _id: roomId,
    participants: userId,
  });
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

const updateOne = async (
  { userId: participants, roomId: _id }: TChatRoomQuery,
  data: TChatRoomMutableData,
): Promise<void> => {
  const query = { _id, participants };
  const persists = await ChatRoomRepo.persists(query);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);
  }

  return ChatRoomRepo.updateOne(query, data);
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
};
