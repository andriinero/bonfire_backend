import User, { TUser, TUserMutable } from '@src/models/User';

const getAll = async (): Promise<TUser[]> => {
  const allUsers = await User.find().exec();

  return allUsers;
};

const getOne = async (query: object): Promise<TUser | null> => {
  const user = await User.findById(query).exec();

  return user;
};

const createOne = async (data: TUserMutable): Promise<void> => {
  const newUser = new User(data);
  await newUser.save();
};

const updateOne = async (query: object, data: TUserMutable): Promise<void> => {
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
