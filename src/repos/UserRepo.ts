import EnvVars from '@src/constants/EnvVars';

import type { TUserSchema } from '@src/models/User';
import type { TQueryOptions } from '@src/types/TQueryOptions';
import type { Document, FilterQuery } from 'mongoose';

import User from '@src/models/User';

type TQuery = FilterQuery<TUserSchema>;

type TCreateOne = Omit<TUserSchema, '_id' | 'profile_image' | 'contacts'>;

type TUpdateOne = Partial<TUserSchema>;

export type TUserDTO = Omit<TUserSchema, 'password'>;

export type TUserDTODocument = Document<unknown, unknown, TUserDTO> & TUserDTO;

export const USER_DATA_SELECTION = '-password';

const getAll = async (query: TQuery, opts?: TQueryOptions<TUserDTO>) => {
  const allUsers = await User.find(query)
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH)
    .exec();

  return allUsers;
};

const getOne = async (query: TQuery) => {
  const user = await User.findOne(query).exec();

  return user;
};

const createOne = async (data: TCreateOne) => {
  const newUser = new User(data);
  await newUser.save();
};

const updateOne = async (query: TQuery, data: TUpdateOne) => {
  await User.findOneAndUpdate(query, data, {
    runValidators: true,
    new: true,
  });
};

const deleteOne = async (id: string) => {
  await User.findByIdAndDelete(id);
};

const persistOne = async (query: TQuery) => {
  const persistingUser = await User.findOne(query).exec();

  return !!persistingUser;
};

const persistMany = async (ids: string[]) => {
  const persistingUsers = await User.find({ _id: { $in: ids } }).exec();

  return persistingUsers.length === ids.length;
};

const count = async (query: TQuery) => {
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
