import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import ContactRepo from '@src/repos/ContactRepo';
import type { QueryOptions } from '@src/types/QueryOptions';
import { getRandomColorClass } from '@src/util/getRandomColorClass';

import MessageService from './MessageService';

export const CHAT_ROOM_NOT_FOUND_ERR = 'Chat room not found';

const getByUserId = async (userId: string, queryOpts?: QueryOptions) => {
  const allChatRooms = await ChatRoomRepo.getAll(
    { participants: { some: { id: userId } } },
    queryOpts,
  );

  return allChatRooms;
};

const getById = async (chatRoomId: string, userId: string) => {
  const foundChatRoom = await ChatRoomRepo.getOneByUserId(chatRoomId, userId);
  if (!foundChatRoom)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);

  return foundChatRoom;
};

const createOne = async (currentUserUserId: string, userIds: string[]) => {
  const persists = await ContactRepo.hasContactsWithIds(
    currentUserUserId,
    userIds,
  );
  if (!persists)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Contacts not found');

  const chatRoomDetails = {
    participants: {
      connect: [currentUserUserId, ...userIds].map((participantId) => ({
        id: participantId,
      })),
    },
    created: new Date(),
    colorClass: getRandomColorClass(),
  };
  const createdChatRoomId = await ChatRoomRepo.createOne(chatRoomDetails);

  await MessageService.createActionMessage({
    chatRoomId: createdChatRoomId,
    body: 'chat room created',
  });
};

const getPageCount = async (userId: string) => {
  const docCount = await ChatRoomRepo.getCountByUserId(userId);

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  getByUserId,
  getById,
  createOne,
  getPageCount,
} as const;
