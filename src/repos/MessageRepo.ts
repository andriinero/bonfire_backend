import Message, { TMessage } from '@src/models/Message';
import { FilterQuery } from 'mongoose';

type TQuery = FilterQuery<TMessage>;

type TCreate = Omit<TMessage, '_id'>;

export type TUpdateMessage = Partial<TMessage>;

const getAll = async (query: TQuery): Promise<TMessage[]> => {
  const messages = await Message.find(query).exec();

  return messages;
};

const getOne = async (query: TQuery): Promise<TMessage | null> => {
  const message = await Message.findOne(query).exec();

  return message;
};

const createOne = async (data: TCreate): Promise<TMessage> => {
  const message = new Message(data);
  const savedMessage = await message.save();

  return savedMessage;
};

const updateOne = async (
  query: TQuery,
  messageData: TUpdateMessage,
): Promise<void> => {
  await Message.findOneAndUpdate(query, messageData, { runValidators: true });
};

const deleteOne = async (query: TQuery): Promise<void> => {
  await Message.deleteOne(query);
};

const persists = async (ids: string[]): Promise<boolean> => {
  const messages = await Message.find({ _id: { $in: ids } }).exec();

  return ids.length === messages.length;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  persists,
} as const;
