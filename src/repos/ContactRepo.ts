import { Prisma } from '@prisma/client';
import EnvVars from '@src/constants/EnvVars';
import prisma from '@src/prisma';
import type { PaginationOptions } from '@src/types/QueryOptions';

type WhereQuery = Prisma.UserWhereInput;

const getAllByUserId = async (
  userId: string,
  query?: WhereQuery,
  opts?: PaginationOptions,
) => {
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;
  const limit = opts?.limit;

  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { contacts: { where: query, take: limit, skip: skip } },
  });

  return user?.contacts;
};

const addByUserId = async (userId: string, contactId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { contacts: { connect: { id: contactId } } },
  });
};

const removeByUserId = async (userId: string, contactId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { contacts: { disconnect: { id: contactId } } },
  });
};

const getCountByUserId = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { _count: { select: { contacts: true } } },
  });

  return user ? user._count.contacts : 0;
};

const hasContactsWithIds = async (userId: string, contactIds: string[]) => {
  const userWithContacts = await prisma.user.findFirst({
    where: {
      id: userId,
      AND: contactIds.map((id) => ({ contacts: { some: { id } } })),
    },
  });

  return !!userWithContacts;
};

export default {
  getAllByUserId,
  addByUserId,
  removeByUserId,
  getCountByUserId,
  hasContactsWithIds,
} as const;
