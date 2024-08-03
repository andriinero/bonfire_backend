import EnvVars from '@src/constants/EnvVars';

import type { TMessageSchema } from '@src/models/Message';
import type { TIdQuery } from '@src/types/IdQuery';
import type { TQueryOptions } from '@src/types/TQueryOptions';
import type { FilterQuery } from 'mongoose';

import Message from '@src/models/Message';

type TQuery = FilterQuery<TMessageSchema>;

type TCreateOne = Pick<TMessageSchema, 'body' | 'type' | 'created'> &
  Partial<Pick<TMessageSchema, 'user' | 'reply'>> & {
    chat_room: TIdQuery;
  };

const getAll = async (query: TQuery, opts?: TQueryOptions<TMessageSchema>) => {
  const messages = await Message.find(query)
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH)
    .exec();

  return messages;
};

const getOne = async (query: TQuery) => {
  const message = await Message.findOne(query).exec();

  return message;
};

const createOne = async (data: TCreateOne) => {
  const message = new Message(data);
  const savedMessage = await message.save();

  return savedMessage;
};

const updateOne = async (
  query: TQuery,
  messageData: Partial<TMessageSchema>,
) => {
  await Message.findOneAndUpdate(query, messageData, { runValidators: true });
};

const deleteOne = async (query: TQuery) => {
  await Message.deleteOne(query);
};

const persists = async (ids: TIdQuery[]) => {
  const messages = await Message.find({ _id: { $in: ids } }).exec();

  return ids.length === messages.length;
};

const getCount = async (query: TQuery) => {
  const docCount = await Message.countDocuments(query).exec();

  return docCount;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  persists,
  getCount,
} as const;
