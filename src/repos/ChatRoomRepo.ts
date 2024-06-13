import EnvVars from '@src/constants/EnvVars';
import ChatRoom, { TChatRoom, TChatRoomDocument } from '@src/models/ChatRoom';
import { TQueryOptions } from '@src/types/TQueryOptions';
import { FilterQuery, Types } from 'mongoose';

type TQuery = FilterQuery<TChatRoom>;

type TCreate = Omit<TChatRoom, '_id' | 'name'>;

export type TUpdateChatRoom = Partial<TChatRoom>;

const getAll = async (
  query: TQuery,
  opts?: TQueryOptions<TChatRoom>,
): Promise<TChatRoomDocument[]> => {
  const allChatRooms = await ChatRoom.find(query)
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH)
    .exec();

  return allChatRooms;
};

const getOne = async (query: TQuery): Promise<TChatRoomDocument | null> => {
  const chatRoom = await ChatRoom.findOne(query).exec();

  return chatRoom;
};

const createOne = async (data: TCreate): Promise<Types.ObjectId> => {
  const newChatRoom = new ChatRoom(data);
  await newChatRoom.save();

  return newChatRoom._id;
};

const updateOne = async (
  query: TQuery,
  newData: TUpdateChatRoom,
): Promise<void> => {
  await ChatRoom.findOneAndUpdate(query, newData, {
    runValidators: true,
    new: true,
  }).exec();
};

const persists = async (query: TQuery): Promise<boolean> => {
  const persistingChatRoom = await ChatRoom.countDocuments(query).exec();

  return persistingChatRoom > 0;
};

const getCount = async (query: TQuery): Promise<number> => {
  const docCount = await ChatRoom.countDocuments(query).exec();

  return docCount;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  persists,
  getCount,
} as const;
