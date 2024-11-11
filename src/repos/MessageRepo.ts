import { Prisma } from '@prisma/client';
import EnvVars from '@src/constants/EnvVars';
import type { TMessageSchema } from '@src/models/Message';
import Message from '@src/models/Message';
import prisma from '@src/prisma';
import type { TIdQuery } from '@src/types/IdQuery';
import type { TQueryOptions } from '@src/types/TQueryOptions';

type WhereQuery = Prisma.MessageWhereInput;

type TCreateOne = Pick<TMessageSchema, 'body' | 'type' | 'created'> &
  Partial<Pick<TMessageSchema, 'user' | 'reply'>> & {
    chat_room: TIdQuery;
  };

const getAll = async (
  query: WhereQuery,
  opts?: TQueryOptions<TMessageSchema>,
) => {
  const messages = await Message.find(query)
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH)
    .exec();

  return messages;
};

const getOne = async (query: WhereQuery) => {
  const message = await Message.findOne(query).exec();

  return message;
};

const createOne = async (data: TCreateOne) => {
  const message = new Message(data);
  const savedMessage = await message.save();

  return savedMessage;
};

const updateOne = async (
  query: WhereQuery,
  messageData: Partial<TMessageSchema>,
) => {
  await Message.findOneAndUpdate(query, messageData, { runValidators: true });
};

const deleteOne = async (query: WhereQuery) => {
  await Message.deleteOne(query);
};

const persists = async (ids: TIdQuery[]) => {
  const messages = await Message.find({ _id: { $in: ids } }).exec();

  return ids.length === messages.length;
};

const getCount = async (query: WhereQuery) => {
  const docCount = await prisma.message.countDocuments(query).exec();

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
