import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TChatRoom } from '@src/models/ChatRoom';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo, { TUpdateChatRoom } from '@src/repos/ChatRoomRepo';
import UserRepo from '@src/repos/UserRepo';
import { getChatRoomName } from '@src/util/chatRoomUtils';
import { Types } from 'mongoose';
import { USER_NOT_FOUND_ERR } from './AuthService';

type TChatRoomQuery = {
  userId: string;
  roomId: string;
};

type TCreateChatRoomData = {
  participants: string[];
};

export const CHAT_ROOM_NOT_FOUND_ERR = 'Chat room not found';

const getAllByUserId = async (userId: string): Promise<TChatRoom[]> => {
  const allChatRooms = await ChatRoomRepo.getAll({ participants: userId });

  return allChatRooms;
};

const getOneById = async ({
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

const createOne = async (
  currentUserId: string,
  postData: TCreateChatRoomData,
): Promise<void> => {
  const persist = await UserRepo.persistMany(postData.participants);

  if (!persist) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  const participantsIds = postData.participants.map(
    (p) => new Types.ObjectId(p),
  );
  const users = await UserRepo.getAll({ _id: { $in: participantsIds } });
  const chatRoomName = getChatRoomName(currentUserId, users);

  const chatRoomDetails = {
    ...postData,
    name: chatRoomName,
    created: new Date(),
  };

  return ChatRoomRepo.createOne(chatRoomDetails);
};

const updateOne = async (
  { userId: participants, roomId: _id }: TChatRoomQuery,
  data: TUpdateChatRoom,
): Promise<void> => {
  const query = { _id, participants };
  const persists = await ChatRoomRepo.persists(query);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);
  }

  return ChatRoomRepo.updateOne(query, data);
};

export default {
  getAllByUserId,
  getOneById,
  createOne,
  updateOne,
};
