import { Prisma } from '@prisma/client';
import prisma from '@src/prisma';

import EnvVars from '@src/constants/EnvVars';

import type { TUserSchema } from '@src/models/User';
import type { TQueryOptions } from '@src/types/TQueryOptions';
import type { Document } from 'mongoose';

type WhereQuery = Prisma.UserWhereInput;

type WhereUniqueQuery = Prisma.UserWhereUniqueInput;

type CreateData = Prisma.UserCreateInput;

type UpdateData = Prisma.UserUpdateInput;

export type TUserDTO = Omit<TUserSchema, 'password'>;

export type TUserDTODocument = Document<unknown, unknown, TUserDTO> & TUserDTO;

export const USER_DATA_SELECTION = '-password';

const getAll = async (query: WhereQuery, opts?: TQueryOptions<TUserDTO>) => {
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;
  const limit = opts?.limit ?? 0;

  const users = await prisma.user.findMany({ where: query, take: limit, skip });

  return users;
};

const getOne = async (query: WhereQuery, omitPassword?: boolean) => {
  const user = await prisma.user.findFirst({
    where: query,
    omit: { password: omitPassword },
  });

  return user;
};

const createOne = async (data: CreateData) => {
  await prisma.user.create({ data });
};

const updateOne = async (query: WhereUniqueQuery, data: UpdateData) => {
  await prisma.user.update({ where: query, data });
};

const deleteOne = async (query: WhereUniqueQuery) => {
  await prisma.user.delete({ where: query });
};

const persistOne = async (query: WhereQuery) => {
  const persistingUser = await prisma.user.findFirst({ where: query });

  return !!persistingUser;
};

const persistManyByIds = async (userIds: string[]) => {
  const count = await prisma.user.count({
    where: { id: { in: userIds } },
  });

  return count;
};

const count = async (query: WhereQuery) => {
  const userCount = await prisma.user.count({ where: query });

  return userCount;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  persistOne,
  persistManyByIds,
  count,
} as const;
