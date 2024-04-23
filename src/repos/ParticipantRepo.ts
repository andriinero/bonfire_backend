import EnvVars from '@src/constants/EnvVars';
import ChatRoom, { TChatRoom } from '@src/models/ChatRoom';
import { TUserPublic } from '@src/models/User';
import { TQueryOptions } from '@src/types/TQueryOptions';

type TQuery = Pick<TChatRoom, '_id'>;

const USER_FILED_SELECTION = '-password';

const getAll = async (
  query: TQuery,
  opts?: TQueryOptions<TUserPublic>,
): Promise<TUserPublic[]> => {
  const chatRoom = (await ChatRoom.findById(query._id, 'participants')
    .populate({ path: 'participants', select: USER_FILED_SELECTION })
    .select('participants')
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.maxDocsPerFetch)
    .exec()) as unknown as { participants: TUserPublic[] };

  return chatRoom.participants ?? [];
};

export default {
  getAll,
} as const;
