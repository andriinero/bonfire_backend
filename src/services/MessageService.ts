import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TMessage } from '@src/models/Message';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import MessageRepo, {
  TCreateMessageData,
  TMessageMutable,
} from '@src/repos/MessageRepo';
import { CHAT_ROOM_NOT_FOUND_ERR } from './ChatRoomService';

export const MESSAGE_NOT_FOUND_ERR = '';

const getAllByChatRoomId = async (chatRoomId: string): Promise<TMessage[]> => {
  const persists = await ChatRoomRepo.persists({ _id: chatRoomId });
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);
  }

  const messages = await MessageRepo.getAll({ chat_room: chatRoomId });
  return messages;
};

const getOneById = async (id: string): Promise<TMessage> => {
  const message = await MessageRepo.getOne({ _id: id });
  if (!message) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, MESSAGE_NOT_FOUND_ERR);
  }

  return message;
};

const createOne = async (data: TCreateMessageData): Promise<void> => {
  await MessageRepo.createOne(data);
};

const updateOneById = async (
  id: string,
  data: TMessageMutable,
): Promise<void> => {
  await MessageRepo.updateOne({ _id: id }, data);
};

const deleteOneById = async (id: string): Promise<void> => {
  await MessageRepo.deleteOne({ _id: id });
};

export default {
  getAllByChatRoomId,
  getOneById,
  createOne,
  updateOneById,
  deleteOneById,
};
