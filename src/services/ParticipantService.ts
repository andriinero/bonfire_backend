import { TUserPublic } from '@src/models/User';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import { USER_DATA_SELECTION } from '@src/repos/UserRepo';
import { TQueryOptions } from '@src/repos/types/TQueryOptions';

const getAllByChatRoomId = async (
  chatRoomId: string,
): Promise<TUserPublic[]> => {
  const queryOpts: TQueryOptions = {
    select: 'participants',
    populate: { path: 'participants', select: USER_DATA_SELECTION },
  };
  const chatRoom = await ChatRoomRepo.getOne({ _id: chatRoomId }, queryOpts);

  return chatRoom ? chatRoom.participants : [];
};

export default {
  getAllByChatRoomId,
};
