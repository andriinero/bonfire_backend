import { Prisma } from '@prisma/client';
import EnvVars from '@src/constants/EnvVars';
import prisma from '@src/prisma';
import type { PaginationOptions } from '@src/types/QueryOptions';

type WhereQuery = Prisma.NotificationWhereInput;

type OrderBy = Prisma.NotificationOrderByWithRelationInput;

type CreateManyData = Prisma.NotificationCreateManyInput;

const notificationDataSelection = {
  id: true,
  body: true,
  type: true,
  created: true,
  isRead: true,
  sender: {
    select: {
      id: true,
      username: true,
      colorClass: true,
      profileImage: true,
    },
  },
};

const getAllByReceiverId = async (
  id: string,
  orderBy?: OrderBy,
  opts: PaginationOptions = { limit: undefined, page: 0 },
) => {
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;
  const limit = opts?.limit;

  const notifications = await prisma.notification.findMany({
    where: { receiverId: id },
    orderBy,
    take: limit,
    skip: skip,
    select: notificationDataSelection,
  });

  return notifications;
};

const getOneById = async (id: string) => {
  const notification = await prisma.notification.findFirst({
    where: { id },
    select: notificationDataSelection,
  });

  return notification;
};

const createMany = async (data: CreateManyData[]) => {
  await prisma.notification.createMany({ data });
};

const deleteManyByReceiverId = async (id: string) => {
  await prisma.notification.deleteMany({ where: { receiverId: id } });
};

const deleteById = async (id: string) => {
  await prisma.notification.delete({ where: { id } });
};

const getCountByReceiverId = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { _count: { select: { receivedNotifications: true } } },
  });

  return user ? user._count.receivedNotifications : 0;
};

export default {
  getAllByReceiverId,
  getOneById,
  createMany,
  deleteManyByReceiverId,
  deleteById,
  getCountByReceiverId,
} as const;
