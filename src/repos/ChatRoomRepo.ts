import ChatRoom, { TChatRoom } from '@src/models/ChatRoom';
import { Types } from 'mongoose';

export type TChatRoomQuery = {
  _id?: Types.ObjectId;
  name?: string;
  participants?: Types.ObjectId | Types.ObjectId[];
};

type TChatRoomCreate = {
  name: string;
  participants: Types.ObjectId[];
  date: Date;
};

export type TChatRoomMutableData = {
  name: string;
};

const getAll = async (query: TChatRoomQuery): Promise<TChatRoom[]> => {
  const allChatRooms = await ChatRoom.find(query).exec();

  return allChatRooms;
};

const getOne = async (query: TChatRoomQuery) => {
  const chatRoom = await ChatRoom.findOne(query).exec();

  return chatRoom;
};

const createOne = async (data: TChatRoomCreate): Promise<void> => {
  const newChatRoom = new ChatRoom(data);
  await newChatRoom.save();
};

const updateOne = async (
  query: TChatRoomQuery,
  newData: TChatRoomMutableData,
): Promise<void> => {
  await ChatRoom.findOneAndUpdate(query, newData, {
    runValidators: true,
    new: true,
  }).exec();
};

const persists = async (query: TChatRoomQuery): Promise<boolean> => {
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
