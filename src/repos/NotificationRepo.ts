import { Prisma } from '@prisma/client';
import EnvVars from '@src/constants/EnvVars';
import prisma from '@src/prisma';
import type { PaginationOptions } from '@src/types/QueryOptions';

type WhereQuery = Prisma.NotificationWhereInput;

type CreateData = Prisma.NotificationCreateInput;

const getAllByUserId = async (
  userId: string,
  query?: WhereQuery,
  opts?: PaginationOptions,
) => {
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;
  const limit = opts?.limit;

  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      receivedNotifications: { where: query, take: limit, skip: skip },
    },
  });

  return user?.receivedNotifications;
};

const createOne = async (data: CreateData) => {
  await prisma.notification.create({ data });
};

const deleteById = async (id: string) => {
  await prisma.notification.delete({ where: { id } });
};

const getCountByUserId = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { _count: { select: { receivedNotifications: true } } },
  });

  return user ? user._count.receivedNotifications : 0;
};

export default {
  getAllByUserId,
  createOne,
  deleteById,
  getCountByUserId,
} as const;
