import EnvVars from '@src/constants/EnvVars';
import Message, { TMessage } from '@src/models/Message';
import { TQueryOptions } from '@src/types/TQueryOptions';
import { Document, FilterQuery } from 'mongoose';

type TQuery = FilterQuery<TMessage>;

type TCreate = Pick<TMessage, 'body' | 'type' | 'created' | 'chat_room'> &
  Partial<Pick<TMessage, 'user' | 'reply'>>;

export type TUpdateMessage = Partial<TMessage>;

const getAll = async (
  query: TQuery,
  opts?: TQueryOptions<TMessage>,
): Promise<(Document<unknown, unknown, TMessage> & TMessage)[]> => {
  const messages = await Message.find(query)
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.maxDocsPerFetch)
    .exec();

  return messages;
};

const getOne = async (
  query: TQuery,
): Promise<(Document<unknown, unknown, TMessage> & TMessage) | null> => {
  const message = await Message.findOne(query).exec();

  return message;
};

const createOne = async (
  data: TCreate,
): Promise<Document<unknown, unknown, TMessage> & TMessage> => {
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
