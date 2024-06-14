import { Types } from 'mongoose';

import EnvVars from '@src/constants/EnvVars';

import ChatRoom from '@src/models/ChatRoom';
import {
  TUserPublic,
  TUserPublicDocument,
  USER_DATA_SELECTION,
} from '@src/models/User';
import { TQueryOptions } from '@src/types/TQueryOptions';

const getAllByChatRoomId = async (
  id: Types.ObjectId | string,
  opts?: TQueryOptions<TUserPublic>,
) => {
  const chatRoom = (await ChatRoom.findById(id)
    .select('participants')
    .populate({ path: 'participants', select: USER_DATA_SELECTION })
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH)
    .exec()) as unknown as {
    participants: TUserPublicDocument[];
  };

  return chatRoom.participants ?? [];
};

const add = async ({
  userId,
  chatRoomId,
}: {
  userId: Types.ObjectId | string;
  chatRoomId: Types.ObjectId | string;
}) => {
  const chatRoom = await ChatRoom.findOne({ _id: chatRoomId }).exec();
  chatRoom?.participants.push(new Types.ObjectId(userId));
  await chatRoom?.save();
};

const remove = async ({
  userId,
  chatRoomId,
}: {
  userId: Types.ObjectId | string;
  chatRoomId: Types.ObjectId | string;
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
  userId: Types.ObjectId | string;
  chatRoomId: Types.ObjectId | string;
}) => {
  const foundParticipantCount = await ChatRoom.countDocuments({
    _id: chatRoomId,
    participants: userId,
  }).exec();

  return foundParticipantCount > 0;
};

const getCountInChatRoom = async (id: Types.ObjectId | string) => {
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
