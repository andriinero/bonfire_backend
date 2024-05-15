import EnvVars from '@src/constants/EnvVars';
import ChatRoom, { TChatRoom } from '@src/models/ChatRoom';
import { TUserPublic, USER_DATA_SELECTION } from '@src/models/User';
import { TQueryOptions } from '@src/types/TQueryOptions';
import { Document } from 'mongoose';

type TQuery = Pick<TChatRoom, '_id'>;

const getAll = async (
  query: TQuery,
  opts?: TQueryOptions<TUserPublic>,
): Promise<(Document<unknown, unknown, TUserPublic> & TUserPublic)[]> => {
  const chatRoom = (await ChatRoom.findById(query._id)
    .select('participants')
    .populate({ path: 'participants', select: USER_DATA_SELECTION })
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.maxDocsPerFetch)
    .exec()) as unknown as {
    participants: (Document<unknown, unknown, TUserPublic> & TUserPublic)[];
  };

  return chatRoom.participants ?? [];
};

const getCount = async (query: TQuery): Promise<number> => {
  const chatRoom = await ChatRoom.findById(query._id).exec();

  return chatRoom ? chatRoom.participants.length : 0;
};

export default {
  getAll,
  getCount,
} as const;
