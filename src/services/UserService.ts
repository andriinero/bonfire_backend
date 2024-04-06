import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TUser, TUserMutable } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import UserRepo from '@src/repos/UserRepo';

export const USER_NOT_FOUND_ERR = 'User not found';

const getAll = async (): Promise<TUser[]> => {
  const allUsers = await UserRepo.getAll();

  return allUsers;
};

const getOneById = async (id: string): Promise<TUser | null> => {
  const foundUser = await UserRepo.getOne(id);
  if (!foundUser) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  return foundUser;
};

const createOne = async (userData: TUserMutable): Promise<void> => {
  return UserRepo.createOne(userData);
};

const updateOne = async (id: string, data: TUserMutable): Promise<void> => {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  return UserRepo.updateOne(id, data);
};

const deleteOne = async (id: string): Promise<void> => {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  return UserRepo.deleteOne(id);
};

export default { getAll, getOne: getOneById, createOne, updateOne, deleteOne };
