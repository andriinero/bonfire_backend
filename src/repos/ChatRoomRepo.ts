import EnvVars from '@src/constants/EnvVars';

import type { TChatRoom } from '@src/models/ChatRoom';
import type { TIdQuery } from '@src/types/IdQuery';
import type { TQueryOptions } from '@src/types/TQueryOptions';
import type { FilterQuery } from 'mongoose';

import ChatRoom from '@src/models/ChatRoom';

type TQuery = FilterQuery<TChatRoom>;

type TCreate = Omit<TChatRoom, '_id' | 'name' | 'participants'> & {
  participants: TIdQuery[];
};

export type TUpdateChatRoom = Partial<TChatRoom>;

const getAll = async (query: TQuery, opts?: TQueryOptions<TChatRoom>) => {
  const allChatRooms = await ChatRoom.find(query)
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH)
    .exec();

  return allChatRooms;
};

const getOne = async (query: TQuery) => {
  const chatRoom = await ChatRoom.findOne(query).exec();

  return chatRoom;
};

const createOne = async (data: TCreate) => {
  const newChatRoom = new ChatRoom(data);
  await newChatRoom.save();

  return newChatRoom._id;
};

const updateOne = async (query: TQuery, newData: TUpdateChatRoom) => {
  await ChatRoom.findOneAndUpdate(query, newData, {
    runValidators: true,
    new: true,
  }).exec();
};

const persists = async (query: TQuery) => {
  const persistingChatRoom = await ChatRoom.countDocuments(query).exec();

  return persistingChatRoom > 0;
};

const getCount = async (query: TQuery) => {
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
