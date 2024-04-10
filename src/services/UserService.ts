import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TUser, TUserMutable, UserPost } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import UserRepo from '@src/repos/UserRepo';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';

export const USER_NOT_FOUND_ERR = 'User not found';

const getAll = async (): Promise<TUser[]> => {
  const allUsers = await UserRepo.getAll();

  return allUsers;
};

const getOneById = async (_id: Types.ObjectId): Promise<TUser | null> => {
  const foundUser = await UserRepo.getOne({ _id });
  if (!foundUser) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  return foundUser;
};

const createOne = async (userData: UserPost): Promise<void> => {
  const hashedPassword = await bcrypt.hash(
    userData.password,
    +EnvVars.Bcrypt.Salt,
  );
  const userDetails = { ...userData, password: hashedPassword };

  UserRepo.createOne(userDetails);
};

const updateOne = async (
  _id: Types.ObjectId,
  data: TUserMutable,
): Promise<void> => {
  const query = { _id };
  const persists = await UserRepo.persists(query);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  UserRepo.updateOne(query, data);
};

export default { getAll, getOneById, createOne, updateOne };
