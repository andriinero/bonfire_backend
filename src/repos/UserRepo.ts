import User, { TUser, TUserMutable } from '@src/models/User';

const getAll = async (): Promise<TUser[]> => {
  const allUsers = await User.find().exec();

  return allUsers;
};

const getOne = async (id: string): Promise<TUser | null> => {
  const user = await User.findById(id).exec();

  return user;
};

const createOne = async (data: TUserMutable): Promise<void> => {
  const newUser = new User(data);
  await newUser.save();
};

const updateOne = async (id: string, data: TUserMutable): Promise<void> => {
  await User.findByIdAndUpdate(id, data, {
    runValidators: true,
    new: true,
  });
};

const deleteOne = async (id: string): Promise<void> => {
  await User.findByIdAndDelete(id);
};

const persists = async (id: string): Promise<boolean> => {
  const persistingUser = await User.findById(id).exec();

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
