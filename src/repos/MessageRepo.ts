import { Prisma } from '@prisma/client';
import EnvVars from '@src/constants/EnvVars';
import type { TMessageSchema } from '@src/models/Message';
import Message from '@src/models/Message';
import prisma from '@src/prisma';
import type { TQueryOptions } from '@src/types/TQueryOptions';

type WhereQuery = Prisma.MessageWhereInput;

type WhereUniqueQuery = Prisma.MessageWhereUniqueInput;

type CreateData = Prisma.MessageCreateInput;

type UpdateData = Prisma.MessageUpdateInput;

const getAll = async (
  query: WhereQuery,
  opts?: TQueryOptions<TMessageSchema>,
) => {
  const limit = opts?.limit;
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;

  const messages = await prisma.message.findMany({
    where: query,
    take: limit,
    skip,
  });

  return messages;
};

const getOne = async (query: WhereQuery) => {
  const message = await prisma.message.findFirst({ where: query });

  return message;
};

const createOne = async (data: CreateData) => {
  const createdMessage = await prisma.message.create({ data });

  return createdMessage;
};

const updateOne = async (query: WhereUniqueQuery, data: UpdateData) => {
  await Message.findOneAndUpdate(query, data, { runValidators: true });
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
