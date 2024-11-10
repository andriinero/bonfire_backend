import prisma from '@src/prisma';

import EnvVars from '@src/constants/EnvVars';

import type { TUserSchema } from '@src/models/User';
import type { TQueryOptions } from '@src/types/TQueryOptions';
import type { Document } from 'mongoose';

import { Prisma } from '@prisma/client';
import User from '@src/models/User';

type WhereQuery = Prisma.UserWhereInput;

type TCreateOne = Omit<TUserSchema, '_id' | 'profile_image' | 'contacts'>;

type TUpdateOne = Partial<TUserSchema>;

export type TUserDTO = Omit<TUserSchema, 'password'>;

export type TUserDTODocument = Document<unknown, unknown, TUserDTO> & TUserDTO;

export const USER_DATA_SELECTION = '-password';

const getAll = async (query: WhereQuery, opts?: TQueryOptions<TUserDTO>) => {
  const allUsers = await User.find(query)
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH)
    .exec();

  return allUsers;
};

const getOne = async (query: WhereQuery, excludePassword?: boolean) => {
  const user = await prisma.user.findFirst({
    where: query,
    omit: { password: excludePassword },
  });

  return user;
};

const createOne = async (data: TCreateOne) => {
  const newUser = new User(data);
  await newUser.save();
};

const updateOne = async (query: WhereQuery, data: TUpdateOne) => {
  await User.findOneAndUpdate(query, data, {
    runValidators: true,
    new: true,
  });
};

const deleteOne = async (id: string) => {
  await User.findByIdAndDelete(id);
};

const persistOne = async (query: WhereQuery) => {
  const persistingUser = await prisma.user.findFirst({ where: query });

  return !!persistingUser;
};

const persistMany = async (ids: string[]) => {
  const persistingUsers = await User.find({ _id: { $in: ids } }).exec();

  return persistingUsers.length === ids.length;
};

const count = async (query: WhereQuery) => {
  const docCount = await User.countDocuments(query).exec();

  return docCount;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  persistOne,
  persistMany,
  count,
} as const;
