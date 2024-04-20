import ChatRoom, { TChatRoom } from '@src/models/ChatRoom';
import { getQueryOpts } from '@src/util/misc';
import { USER_DATA_SELECTION } from './UserRepo';
import { TQueryOptions } from './types/TQueryOptions';

type TRepoQuery = {
  _id?: string;
  name?: string;
  participants?: string | string[];
};

type TCreateData = {
  name: string;
  participants: string[];
  date: Date;
};

export type TChatRoomMutableData = {
  name: string;
};

const getAll = async (query: TRepoQuery): Promise<TChatRoom[]> => {
  const allChatRooms = await ChatRoom.find(query)
    .populate('participants', USER_DATA_SELECTION)
    .exec();

  return allChatRooms;
};

const getOne = async (query: TRepoQuery, opts?: TQueryOptions) => {
  const newOpts = getQueryOpts(opts);

  const chatRoom = await ChatRoom.findOne(query)
    .select(newOpts.select)
    .populate(newOpts.populate.path, newOpts.populate.select)
    .exec();

  return chatRoom;
};

const createOne = async (data: TCreateData): Promise<void> => {
  const newChatRoom = new ChatRoom(data);
  await newChatRoom.save();
};

const updateOne = async (
  query: TRepoQuery,
  newData: TChatRoomMutableData,
): Promise<void> => {
  await ChatRoom.findOneAndUpdate(query, newData, {
    runValidators: true,
    new: true,
  }).exec();
};

const persists = async (query: TRepoQuery): Promise<boolean> => {
  const persistingChatRoom = await ChatRoom.findOne(query).exec();

  return !!persistingChatRoom;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  persists,
};
