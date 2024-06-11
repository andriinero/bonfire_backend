import EnvVars from '@src/constants/EnvVars';
import { TUserPublicDocument } from '@src/models/User';
import ParticipantRepo from '@src/repos/ParticipantRepo';
import { Types } from 'mongoose';

const getParticipantsByChatRoomId = async (
  chatRoomId: Types.ObjectId,
): Promise<TUserPublicDocument[]> => {
  const participants = await ParticipantRepo.getAll({ _id: chatRoomId });

  return participants;
};

const getParticipantPageCount = async (
  chatRoomId: Types.ObjectId,
): Promise<number> => {
  const docCount = await ParticipantRepo.getCount({ _id: chatRoomId });

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  getParticipantsByChatRoomId,
  getParticipantPageCount,
} as const;
