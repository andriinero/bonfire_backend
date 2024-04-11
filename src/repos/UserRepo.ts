import User, { TUser } from '@src/models/User';

type TQuery = {
  _id?: string;
  username?: string;
  email?: string;
};

type TUserMutable = {
  username?: string;
  email?: string;
  password?: string;
};

type TCreate = {
  username: string;
  email: string;
  password: string;
  created: Date;
  profile_image?: string;
};

const getAll = async (): Promise<TUser[]> => {
  const allUsers = await User.find().exec();

  return allUsers;
};

const getOne = async (query: TQuery): Promise<TUser | null> => {
  const user = await User.findOne(query).exec();

  return user;
};

const createOne = async (data: TCreate): Promise<void> => {
  const newUser = new User(data);
  await newUser.save();
};

const updateOne = async (query: TQuery, data: TUserMutable): Promise<void> => {
  await User.findOneAndUpdate(query, data, {
    runValidators: true,
    new: true,
  });
};

const deleteOne = async (query: object): Promise<void> => {
  await User.findOneAndDelete(query);
};

const persists = async (query: object): Promise<boolean> => {
  const persistingUser = await User.findOne(query).exec();

  return !!persistingUser;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  persists,
} as const;
