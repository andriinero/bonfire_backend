import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TUserPublicDocument } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import ParticipantRepo from '@src/repos/ParticipantRepo';
import UserRepo from '@src/repos/UserRepo';
import { Types } from 'mongoose';
import { USER_NOT_FOUND_ERR } from './AuthService';
import { CHAT_ROOM_NOT_FOUND_ERR } from './ChatRoomService';

const PARTICIPANT_ALREADY_IN_CHAT_ROOM_ERR = 'This user has already been added';

const getByChatRoomId = async (
  chatRoomId: Types.ObjectId,
): Promise<TUserPublicDocument[]> => {
  const participants = await ParticipantRepo.getAll({ _id: chatRoomId });

  return participants;
};

const addParticipant = async ({
  userId,
  chatRoomId,
}: {
  userId: Types.ObjectId;
  chatRoomId: Types.ObjectId;
}) => {
  const userPersists = await UserRepo.persistOne({ _id: userId });
  if (!userPersists)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  const chatRoomPersists = await ChatRoomRepo.persists({ _id: chatRoomId });
  if (!chatRoomPersists)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);

  const participantPersists = await ParticipantRepo.persistsInChatRoom({
    userId,
    chatRoomId,
  });
  if (participantPersists)
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      PARTICIPANT_ALREADY_IN_CHAT_ROOM_ERR,
    );

  await ParticipantRepo.addParticipant({ userId, chatRoomId });
};

const removeParticipant = async () => {};

const getPageCount = async (chatRoomId: Types.ObjectId): Promise<number> => {
  const docCount = await ParticipantRepo.getCount({ _id: chatRoomId });

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  getByChatRoomId,
  addParticipant,
  removeParticipant,
  getPageCount,
} as const;
