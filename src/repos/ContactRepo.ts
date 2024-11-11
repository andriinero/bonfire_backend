import { Prisma } from '@prisma/client';
import prisma from '@src/prisma';

import EnvVars from '@src/constants/EnvVars';

import type { TUserDTO } from '@src/repos/UserRepo';
import type { TQueryOptions } from '@src/types/TQueryOptions';

type WhereQuery = Prisma.UserWhereInput;

const getAll = async (query: WhereQuery, opts?: TQueryOptions<TUserDTO>) => {
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;
  const limit = opts?.limit ?? 0;

  const user = await prisma.user.findFirst({
    where: query,
    skip: skip,
    take: limit,
    include: { contacts: true },
  });

  // FIXME: remove comment
  console.log(user);

  return user?.contacts;
};

const add = async (userId: string, contactId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { contactIds: { push: contactId } },
  });
};

const removeByUserId = async (userId: string, contactId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { contactIds: true },
  });
  const updatedContactIds = user?.contactIds.filter((c) => c !== contactId);
  if (updatedContactIds)
    await prisma.user.update({
      where: { id: userId },
      data: { contactIds: { set: updatedContactIds } },
    });
};

const getCount = async (query: WhereQuery) => {
  const user = await prisma.user.findFirst({ where: query });

  return user ? user.contactIds.length : 0;
};

const hasContactsWithIds = async (userId: string, contactIds: string[]) => {
  const userWithContacts = await prisma.user.findFirst({
    where: { id: userId, contactIds: { hasEvery: contactIds } },
  });

  return !!userWithContacts;
};

export default {
  getAll,
  add,
  removeByUserId,
  getCount,
  hasContactsWithIds,
} as const;
