import { TUserPublic } from '@src/models/User';
import ParticipantRepo from '@src/repos/ParticipantRepo';
import { Types } from 'mongoose';

const getAllByChatRoomId = async (
  chatRoomId: Types.ObjectId,
): Promise<TUserPublic[]> => {
  const participants = await ParticipantRepo.getAll({ _id: chatRoomId });

  return participants;
};

export default {
  getAllByChatRoomId,
};
