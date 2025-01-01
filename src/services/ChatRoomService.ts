import { NotificationType } from '@prisma/client';
import EnvVars from '@src/constants/EnvVars';
import NotFoundError from '@src/other/errors/NotFoundError';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import ContactRepo from '@src/repos/ContactRepo';
import type { PaginationOptions } from '@src/types/QueryOptions';
import { getRandomColorClass } from '@src/util/getRandomColorClass';
import MessageService from './MessageService';
import NotificationService from './NotificationService';

const getAllByUserId = async (userId: string, opts?: PaginationOptions) => {
  const allChatRooms = await ChatRoomRepo.getAll(
    { participants: { some: { id: userId } } },
    opts,
  );

  return allChatRooms;
};

const getOneById = async (chatRoomId: string, userId: string) => {
  const chatRoom = await ChatRoomRepo.getOneByUserId(chatRoomId, userId);
  if (!chatRoom) throw new NotFoundError();

  return chatRoom;
};

const createOne = async (userId: string, contactIds: string[]) => {
  const persists = await ContactRepo.hasContactsWithIds(userId, contactIds);
  if (!persists) throw new NotFoundError();

  const chatRoomData = {
    participants: {
      connect: [userId, ...contactIds].map((participantId) => ({
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
  await NotificationService.create({
    receivers: [...contactIds],
    sender: userId,
    body: "you've been added to the chat",
    type: NotificationType.MESSAGE,
  });
};

const getPageCountByUserId = async (userId: string) => {
  const docCount = await ChatRoomRepo.getCountByUserId(userId);

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  getAllByUserId,
  getOneById,
  createOne,
  getPageCountByUserId,
} as const;
