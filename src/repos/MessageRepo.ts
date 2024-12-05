import { Prisma } from '@prisma/client';
import EnvVars from '@src/constants/EnvVars';
import prisma from '@src/prisma';
import type { PaginationOptions } from '@src/types/QueryOptions';

type WhereQuery = Prisma.MessageWhereInput;

type WhereUniqueQuery = Prisma.MessageWhereUniqueInput;

export type CreateMessageData = Prisma.MessageCreateInput;

export type OrderMessageData = Prisma.MessageOrderByWithRelationInput;

export type UpdateMessageData = Prisma.MessageUpdateInput;

const getAll = async (
  query: WhereQuery,
  opts?: PaginationOptions,
  orderBy?: OrderMessageData,
) => {
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;
  const limit = opts?.limit;

  const messages = await prisma.message.findMany({
    where: query,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          isOnline: true,
          colorClass: true,
          profileImage: true,
        },
      },
    },
    orderBy,
    take: limit,
    skip,
  });

  return messages;
};

const getOne = async (query: WhereQuery) => {
  const message = await prisma.message.findFirst({
    where: query,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          isOnline: true,
          colorClass: true,
          profileImage: true,
        },
      },
    },
  });

  return message;
};

const createOne = async (data: CreateMessageData) => {
  const createdMessage = await prisma.message.create({ data });

  return createdMessage;
};

const updateOne = async (query: WhereUniqueQuery, data: UpdateMessageData) => {
  await prisma.message.update({ where: query, data });
};

const deleteOne = async (query: WhereUniqueQuery) => {
  await prisma.message.delete({ where: query });
};

const persistManyByIds = async (messageIds: string[]) => {
  const messageCount = await prisma.chatroom.count({
    where: { id: { in: messageIds } },
  });

  return messageIds.length === messageCount;
};

const getCount = async (query: WhereQuery) => {
  const count = await prisma.message.count({ where: query });

  return count;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  persistManyByIds,
  getCount,
} as const;
