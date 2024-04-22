import ChatRoom, { TChatRoom } from '@src/models/ChatRoom';
import { TUserPublic } from '@src/models/User';

type TQuery = Pick<TChatRoom, '_id'>;

const USER_FILED_SELECTION = '-password';

const getAll = async (query: TQuery): Promise<TUserPublic[]> => {
  const chatRoom = (await ChatRoom.findById(query._id, 'participants')
    .populate({ path: 'participants', select: USER_FILED_SELECTION })
    .select('participants')
    .exec()) as unknown as { participants: TUserPublic[] };

  return chatRoom.participants ?? [];
};

export default {
  getAll,
} as const;
