import ChatRoom, { TChatRoom } from '@src/models/ChatRoom';
import { userDataSelection } from './UserRepo';

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
    .populate('participants', userDataSelection)
    .exec();

  return allChatRooms;
};

const getOne = async (query: TRepoQuery) => {
  const chatRoom = await ChatRoom.findOne(query).exec();

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
