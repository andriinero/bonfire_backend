import EnvVars from '@src/constants/EnvVars';
import ChatRoom, { TChatRoom } from '@src/models/ChatRoom';
import {
  TUserPublic,
  TUserPublicDocument,
  USER_DATA_SELECTION,
} from '@src/models/User';
import { TQueryOptions } from '@src/types/TQueryOptions';
import { Types } from 'mongoose';

type TQuery = Pick<TChatRoom, '_id'>;

const getAll = async (
  query: TQuery,
  opts?: TQueryOptions<TUserPublic>,
): Promise<TUserPublicDocument[]> => {
  const chatRoom = (await ChatRoom.findById(query._id)
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

const addParticipant = async ({
  userId,
  chatRoomId,
}: {
  userId: Types.ObjectId;
  chatRoomId: Types.ObjectId;
}): Promise<void> => {
  const chatRoom = await ChatRoom.findOne({ _id: chatRoomId }).exec();
  chatRoom?.participants.push(userId);
  await chatRoom?.save();
};

const persistsInChatRoom = async ({
  userId,
  chatRoomId,
}: {
  userId: Types.ObjectId;
  chatRoomId: Types.ObjectId;
}): Promise<boolean> => {
  const foundParticipantCount = await ChatRoom.countDocuments({
    _id: chatRoomId,
    participants: userId,
  }).exec();

  return foundParticipantCount > 0;
};

const getCount = async (query: TQuery): Promise<number> => {
  const chatRoom = await ChatRoom.findById(query._id).exec();

  return chatRoom ? chatRoom.participants.length : 0;
};

export default {
  getAll,
  addParticipant,
  persistsInChatRoom,
  getCount,
} as const;
