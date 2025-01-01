import { Prisma } from '@prisma/client';
import EnvVars from '@src/constants/EnvVars';
import prisma from '@src/prisma';
import type { PaginationOptions } from '@src/types/QueryOptions';

type WhereQuery = Prisma.NotificationWhereInput;

type OrderBy = Prisma.NotificationOrderByWithRelationInput;

type CreateManyData = Prisma.NotificationCreateManyInput;

const getAllByUserId = async (
  userId: string,
  query?: WhereQuery,
  orderBy?: OrderBy,
  opts: PaginationOptions = { limit: undefined, page: 0 },
) => {
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;
  const limit = opts?.limit;

  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      receivedNotifications: { where: query, orderBy, take: limit, skip: skip },
    },
  });

  return user?.receivedNotifications;
};

const createMany = async (data: CreateManyData[]) => {
  await prisma.notification.createMany({
    data,
  });
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
  createMany,
  deleteById,
  getCountByUserId,
} as const;
