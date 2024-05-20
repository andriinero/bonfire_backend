import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TChatRoom } from '@src/models/ChatRoom';
import { TUserPublic } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import ParticipantRepo from '@src/repos/ParticipantRepo';
import UserRepo from '@src/repos/UserRepo';
import { TQueryOptions } from '@src/types/TQueryOptions';
import { Document, Types } from 'mongoose';
import { USER_NOT_FOUND_ERR } from './AuthService';
import MessageService from './MessageService';

type TChatRoomQuery = {
  userId: string;
  roomId: string;
};

export const CHAT_ROOM_NOT_FOUND_ERR = 'Chat room not found';

const getChatRoomsByUserId = async (
  userId: string,
  query?: TQueryOptions<TChatRoom>,
): Promise<TChatRoom[]> => {
  const allChatRooms = await ChatRoomRepo.getAll(
    { participants: userId },
    query,
  );

  return allChatRooms;
};

const getChatRoomById = async ({
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
  const id = await ChatRoomRepo.createOne(chatRoomDetails);
  await MessageService.createActionMessage({
    chat_room: id,
    body: 'chat room created',
  });
};

const getParticipantsByChatRoomId = async (
  chatRoomId: Types.ObjectId,
): Promise<(Document<unknown, unknown, TUserPublic> & TUserPublic)[]> => {
  const participants = await ParticipantRepo.getAll({ _id: chatRoomId });

  return participants;
};

const getChatRoomPageCount = async (userId: string): Promise<number> => {
  const docCount = await ChatRoomRepo.getCount({ participants: userId });

  return Math.ceil(docCount / EnvVars.Bandwidth.maxDocsPerFetch);
};

const getParticipantPageCount = async (
  chatRoomId: Types.ObjectId,
): Promise<number> => {
  const docCount = await ParticipantRepo.getCount({ _id: chatRoomId });

  return Math.ceil(docCount / EnvVars.Bandwidth.maxDocsPerFetch);
};

export default {
  getChatRoomsByUserId,
  getChatRoomById,
  createOne,
  getParticipantsByChatRoomId,
  getChatRoomPageCount,
  getParticipantPageCount,
} as const;
