import { Types } from 'mongoose';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';

import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import ParticipantRepo from '@src/repos/ParticipantRepo';
import UserRepo from '@src/repos/UserRepo';

import { USER_NOT_FOUND_ERR } from './AuthService';
import { CHAT_ROOM_NOT_FOUND_ERR } from './ChatRoomService';
import MessageService from './MessageService';

const PARTICIPANT_ALREADY_IN_CHAT_ROOM_ERR = 'This user has already been added';
const PARTICIPANT_NOT_FOUND_ERR = 'Participant not found';

const getByChatRoomId = async (chatRoomId: Types.ObjectId) => {
  const participants = await ParticipantRepo.getAll({ _id: chatRoomId });

  return participants;
};

const addParticipant = async ({
  currentUsername,
  participantId,
  chatRoomId,
}: {
  currentUsername: string;
  participantId: Types.ObjectId;
  chatRoomId: Types.ObjectId;
}) => {
  const user = await UserRepo.getOne({ _id: participantId });
  if (!user)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  const chatRoomPersists = await ChatRoomRepo.persists({ _id: chatRoomId });
  if (!chatRoomPersists)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);

  const participantPersists = await ParticipantRepo.persistsInChatRoom({
    userId: participantId,
    chatRoomId,
  });
  if (participantPersists)
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      PARTICIPANT_ALREADY_IN_CHAT_ROOM_ERR,
    );

  await ParticipantRepo.addParticipant({ userId: participantId, chatRoomId });
  await MessageService.createActionMessage({
    body: `${currentUsername} has added ${user.username}`,
    chat_room: chatRoomId,
  });
};

const removeParticipant = async ({
  currentUsername,
  userId,
  chatRoomId,
}: {
  currentUsername: string;
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
  if (!participantPersists)
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      PARTICIPANT_NOT_FOUND_ERR,
    );

  await ParticipantRepo.removeParticipant({ userId, chatRoomId });
  await MessageService.createActionMessage({
    body: `${currentUsername} has left the chat`,
    chat_room: chatRoomId,
  });
};

const getPageCount = async (chatRoomId: Types.ObjectId) => {
  const docCount = await ParticipantRepo.getCount({ _id: chatRoomId });

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  getByChatRoomId,
  addParticipant,
  removeParticipant,
  getPageCount,
} as const;
