import EnvVars from '@src/constants/EnvVars';
import { RouteError } from '@src/other/classes';
import { getRandomColorClass } from '@src/util/getRandomColorClass';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { TChatRoomSchema } from '@src/models/ChatRoom';
import type { TIdQuery } from '@src/types/IdQuery';
import type { TQueryOptions } from '@src/types/TQueryOptions';

import ChatRoomRepo from '@src/repos/ChatRoomRepo';

import ContactsRepo from '@src/repos/ContactsRepo';
import MessageService from './MessageService';

type TChatRoomQuery = {
  userId: TIdQuery;
  roomId: TIdQuery;
};

export const CHAT_ROOM_NOT_FOUND_ERR = 'Chat room not found';

const getByUserId = async (
  userId: TIdQuery,
  query?: TQueryOptions<TChatRoomSchema>,
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

const createOne = async (currentUserUserId: TIdQuery, userIds: string[]) => {
  const persists = await ContactsRepo.hasContacts(currentUserUserId, userIds);
  if (!persists)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Contacts not found');

  const chatRoomDetails = {
    participants: [currentUserUserId, ...userIds],
    created: new Date(),
    color_class: getRandomColorClass(),
  };
  const createdChatRoomId = await ChatRoomRepo.createOne(chatRoomDetails);

  await MessageService.createActionMessage({
    chat_room: createdChatRoomId,
    body: 'chat room created',
  });
};

const getPageCount = async (userId: TIdQuery) => {
  const docCount = await ChatRoomRepo.getCount({ participants: userId });

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  getByUserId,
  getById,
  createOne,
  getPageCount,
} as const;
