import { Prisma } from '@prisma/client';
import EnvVars from '@src/constants/EnvVars';
import prisma from '@src/prisma';
import { type PaginationOptions } from '@src/types/QueryOptions';

type WhereQuery = Prisma.ChatroomWhereInput;

type WhereUniqueQuery = Prisma.ChatroomWhereUniqueInput;

type CreateData = Prisma.ChatroomCreateInput;

const getAll = async (query: WhereQuery, opts?: PaginationOptions) => {
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;
  const limit = opts?.limit;

  const chatRoomIdsByLatestMessage = await prisma.message.groupBy({
    by: ['chatRoomId'],
    _max: { created: true },
    orderBy: { _max: { created: 'desc' } },
  });
  const chatRoomIds = chatRoomIdsByLatestMessage.map((c) => c.chatRoomId);
  const chatRooms = await prisma.chatroom.findMany({
    where: { id: { in: chatRoomIds } },
    take: limit,
    skip,
  });

  return chatRooms;
};

const getOneById = async (chatRoomId: string) => {
  const chatRoom = await prisma.chatroom.findUnique({
    where: { id: chatRoomId },
  });

  return chatRoom;
};

const getOneByUserId = async (chatRoomId: string, userId: string) => {
  const chatRoom = await prisma.chatroom.findFirst({
    where: { id: chatRoomId, participants: { some: { id: userId } } },
  });

  return chatRoom;
};

const createOne = async (data: CreateData) => {
  const newChatRoom = await prisma.chatroom.create({ data });

  return newChatRoom.id;
};

const persists = async (query: WhereUniqueQuery) => {
  const chatRoom = await prisma.chatroom.findUnique({ where: query });

  return !!chatRoom;
};

const getCountByUserId = async (userId: string) => {
  const count = await prisma.chatroom.count({
    where: { participants: { some: { id: userId } } },
  });

  return count;
};

export default {
  getAll,
  getOneById,
  getOneByUserId,
  createOne,
  persists,
  getCountByUserId,
} as const;
