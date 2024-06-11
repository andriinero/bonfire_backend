import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TChatRoom } from '@src/models/ChatRoom';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import UserRepo from '@src/repos/UserRepo';
import { TQueryOptions } from '@src/types/TQueryOptions';
import { getRandomColorClass } from '@src/util/getRandomColorClass';
import { Types } from 'mongoose';
import { USER_NOT_FOUND_ERR } from './AuthService';
import MessageService from './MessageService';

type TChatRoomQuery = {
  userId: string;
  roomId: string;
};

export const CHAT_ROOM_NOT_FOUND_ERR = 'Chat room not found';

const getByUserId = async (
  userId: string,
  query?: TQueryOptions<TChatRoom>,
): Promise<TChatRoom[]> => {
  const allChatRooms = await ChatRoomRepo.getAll(
    { participants: userId },
    query,
  );

  return allChatRooms;
};

const getById = async ({
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
    color_class: getRandomColorClass(),
  };
  const id = await ChatRoomRepo.createOne(chatRoomDetails);
  await MessageService.createActionMessage({
    chat_room: id,
    body: 'chat room created',
  });
};

const getPageCount = async (userId: string): Promise<number> => {
  const docCount = await ChatRoomRepo.getCount({ participants: userId });

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  getByUserId,
  getById,
  createOne,
  getPageCount,
} as const;
