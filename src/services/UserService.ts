import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TUser } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import UserRepo from '@src/repos/UserRepo';
import { Types } from 'mongoose';

export const USER_NOT_FOUND_ERR = 'User not found';

const getAll = async (): Promise<TUser[]> => {
  const allUsers = await UserRepo.getAll();

  return allUsers;
};

const getOneById = async (userId: Types.ObjectId): Promise<TUser | null> => {
  const foundUser = await UserRepo.getOne({ _id: userId });
  if (!foundUser) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  return foundUser;
};

const createOne = async (user: TUser): Promise<void> => {
  return UserRepo.createOne(user);
};

const updateOne = async (user: TUser): Promise<void> => {
  const persists = await UserRepo.persists({ _id: user._id });
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  return UserRepo.updateOne(user);
};

const deleteOne = async (query: object): Promise<void> => {
  const persists = await UserRepo.persists(query);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  return UserRepo.deleteOne(query);
};

export default { getAll, getOne: getOneById, createOne, updateOne, deleteOne };
