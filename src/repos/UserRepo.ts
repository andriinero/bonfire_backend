import User from '@src/models/User';

import { TUser } from '@src/models/User';

const getAll = async (): Promise<TUser[]> => {
  const allUsers = await User.find().exec();

  return allUsers;
};

const getOne = async (query: object): Promise<TUser | null> => {
  const user = await User.findOne(query).exec();

  return user;
};

const persists = async (query: object): Promise<boolean> => {
  const persistingUser = await User.findOne(query).exec();

  return !!persistingUser;
};

const createOne = async (user: TUser): Promise<void> => {
  const newUser = new User(user);
  await newUser.save();
};

const updateOne = async (user: TUser): Promise<void> => {
  await User.findByIdAndUpdate(user._id, user, {
    runValidators: true,
    new: true,
  });
};

const deleteOne = async (query: object): Promise<void> => {
  await User.deleteOne(query);
};

export default {
  getAll,
  getOne,
  persists,
  createOne,
  updateOne,
  deleteOne,
} as const;
