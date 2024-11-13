import { Prisma } from '@prisma/client';
import EnvVars from '@src/constants/EnvVars';
import prisma from '@src/prisma';
import type { QueryOptions } from '@src/types/TQueryOptions';

type WhereQuery = Prisma.ChatroomWhereInput;

type WhereUniqueQuery = Prisma.ChatroomWhereUniqueInput;

type CreateData = Prisma.ChatroomCreateInput;

const getAll = async (query: WhereQuery, opts?: QueryOptions) => {
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;
  const limit = opts?.limit ?? 0;

  const chatRooms = await prisma.chatroom.findMany({
    where: query,
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
    where: { id: chatRoomId, participtants: { some: { id: userId } } },
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
    where: { participtants: { some: { id: userId } } },
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
