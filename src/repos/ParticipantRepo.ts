import { Types } from 'mongoose';

import EnvVars from '@src/constants/EnvVars';

import type { TUserDTO, TUserDTODocument } from '@src/repos/UserRepo';
import type { TIdQuery } from '@src/types/IdQuery';
import type { TQueryOptions } from '@src/types/TQueryOptions';

import ChatRoom from '@src/models/ChatRoom';

import { USER_DATA_SELECTION } from './UserRepo';

const getAllByChatRoomId = async (
  id: TIdQuery,
  opts?: TQueryOptions<TUserDTO>,
) => {
  const chatRoom = (await ChatRoom.findById(id)
    .select('participants')
    .populate({ path: 'participants', select: USER_DATA_SELECTION })
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH)
    .exec()) as unknown as {
    participants: TUserDTODocument[];
  };

  return chatRoom.participants ?? [];
};

const add = async ({
  userId,
  chatRoomId,
}: {
  userId: TIdQuery;
  chatRoomId: TIdQuery;
}) => {
  const chatRoom = await ChatRoom.findOne({ _id: chatRoomId }).exec();
  chatRoom?.participants.push(new Types.ObjectId(userId));
  await chatRoom?.save();
};

const remove = async ({
  userId,
  chatRoomId,
}: {
  userId: TIdQuery;
  chatRoomId: TIdQuery;
}) => {
  const chatRoom = await ChatRoom.findOne({ _id: chatRoomId }).exec();
  const participantIndex = chatRoom?.participants.findIndex((p) =>
    p.equals(userId),
  );
  if (participantIndex && participantIndex > -1)
    chatRoom?.participants.splice(participantIndex, 1);

  await chatRoom?.save();
};

const persistsInChatRoom = async ({
  userId,
  chatRoomId,
}: {
  userId: TIdQuery;
  chatRoomId: TIdQuery;
}) => {
  const foundParticipantCount = await ChatRoom.countDocuments({
    _id: chatRoomId,
    participants: userId,
  }).exec();

  return foundParticipantCount > 0;
};

const getCountInChatRoom = async (id: TIdQuery) => {
  const chatRoom = await ChatRoom.findById(id).exec();

  return chatRoom ? chatRoom.participants.length : 0;
};

export default {
  getAllByChatRoomId,
  add,
  remove,
  persistsInChatRoom,
  getCountInChatRoom,
} as const;
