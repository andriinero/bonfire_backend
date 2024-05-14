import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TChatRoom } from '@src/models/ChatRoom';
import { TUserPublic } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import ParticipantRepo from '@src/repos/ParticipantRepo';
import UserRepo from '@src/repos/UserRepo';
import { getQueryOpts } from '@src/util/misc';
import { Document, Types } from 'mongoose';
import { USER_NOT_FOUND_ERR } from './AuthService';

type TChatRoomQuery = {
  userId: string;
  roomId: string;
};

export const CHAT_ROOM_NOT_FOUND_ERR = 'Chat room not found';

const getAllByUserId = async (userId: string): Promise<TChatRoom[]> => {
  const opts = getQueryOpts();
  const allChatRooms = await ChatRoomRepo.getAll(
    { participants: userId },
    opts,
  );

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
  currentUserUserId: Types.ObjectId,
  participantId: Types.ObjectId,
): Promise<void> => {
  const persist = await UserRepo.persistOne({ _id: participantId });

  if (!persist) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  const chatRoomDetails = {
    participants: [currentUserUserId, participantId],
    created: new Date(),
  };

  return ChatRoomRepo.createOne(chatRoomDetails);
};

const getAllByChatRoomId = async (
  chatRoomId: Types.ObjectId,
): Promise<(Document<unknown, unknown, TUserPublic> & TUserPublic)[]> => {
  const participants = await ParticipantRepo.getAll({ _id: chatRoomId });

  return participants;
};

export default {
  getAllByUserId,
  getOneById,
  createOne,
  getAllByChatRoomId,
} as const;
