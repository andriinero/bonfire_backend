import EnvVars from '@src/constants/EnvVars';

import type { TChatRoomSchema } from '@src/models/ChatRoom';
import type { TIdQuery } from '@src/types/IdQuery';
import type { TQueryOptions } from '@src/types/TQueryOptions';
import type { FilterQuery } from 'mongoose';

import ChatRoom from '@src/models/ChatRoom';

type TQuery = FilterQuery<TChatRoomSchema>;

type TCreateOne = Omit<TChatRoomSchema, '_id' | 'name' | 'participants'> & {
  participants: TIdQuery[];
};

const getAll = async (query: TQuery, opts?: TQueryOptions<TChatRoomSchema>) => {
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

const createOne = async (data: TCreateOne) => {
  const newChatRoom = new ChatRoom(data);
  await newChatRoom.save();

  return newChatRoom._id;
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
  persists,
  getCount,
} as const;
