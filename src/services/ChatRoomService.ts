import EnvVars from '@src/constants/EnvVars';
import NotFoundError from '@src/other/errors/NotFoundError';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import ContactRepo from '@src/repos/ContactRepo';
import type { QueryOptions } from '@src/types/QueryOptions';
import { getRandomColorClass } from '@src/util/getRandomColorClass';
import MessageService from './MessageService';

const getByUserId = async (userId: string, queryOpts?: QueryOptions) => {
  const allChatRooms = await ChatRoomRepo.getAll(
    { participants: { some: { id: userId } } },
    queryOpts,
  );

  return allChatRooms;
};

const getById = async (chatRoomId: string, userId: string) => {
  const chatRoom = await ChatRoomRepo.getOneByUserId(chatRoomId, userId);
  if (!chatRoom) throw new NotFoundError();

  return chatRoom;
};

const createOne = async (currentUserUserId: string, userIds: string[]) => {
  const persists = await ContactRepo.hasContactsWithIds(
    currentUserUserId,
    userIds,
  );
  if (!persists) throw new NotFoundError();

  const chatRoomData = {
    participants: {
      connect: [currentUserUserId, ...userIds].map((participantId) => ({
        id: participantId,
      })),
    },
    created: new Date(),
    colorClass: getRandomColorClass(),
  };
  const createdChatRoomId = await ChatRoomRepo.createOne(chatRoomData);

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
