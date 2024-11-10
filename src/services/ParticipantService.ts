import EnvVars from '@src/constants/EnvVars';
import { RouteError } from '@src/other/classes';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { TIdQuery } from '@src/types/IdQuery';

import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import ParticipantRepo from '@src/repos/ParticipantRepo';
import UserRepo from '@src/repos/UserRepo';

import { USER_NOT_FOUND_ERR } from './AuthService';
import { CHAT_ROOM_NOT_FOUND_ERR } from './ChatRoomService';
import MessageService from './MessageService';

const PARTICIPANT_ALREADY_IN_CHAT_ROOM_ERR = 'This user has already been added';
const PARTICIPANT_NOT_FOUND_ERR = 'Participant not found';

const getByChatRoomId = async (chatRoomId: TIdQuery) => {
  const participants = await ParticipantRepo.getAllByChatRoomId(chatRoomId);

  return participants;
};

const addParticipant = async ({
  currentUsername,
  participantUsername,
  chatRoomId,
}: {
  currentUsername: string;
  participantUsername: string;
  chatRoomId: string;
}) => {
  const participant = await UserRepo.getOne({ username: participantUsername });
  if (!participant)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  const chatRoom = await ChatRoomRepo.getOneById(chatRoomId);
  if (!chatRoom)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, CHAT_ROOM_NOT_FOUND_ERR);

  const participantPersists = await ParticipantRepo.persistsInChatRoom({
    userId: participant.id,
    chatRoomId: chatRoom.id,
  });
  if (participantPersists)
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      PARTICIPANT_ALREADY_IN_CHAT_ROOM_ERR,
    );

  await ParticipantRepo.add({
    userId: participant.id,
    chatRoomId: chatRoom.id,
  });
  await MessageService.createActionMessage({
    body: `${currentUsername} has added ${participant.username}`,
    chat_room: chatRoom.id,
  });
};

const removeParticipant = async ({
  currentUsername,
  userId,
  chatRoomId,
}: {
  currentUsername: string;
  userId: string;
  chatRoomId: string;
}) => {
  const userPersists = await UserRepo.persistOne({ id: userId });
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

  await ParticipantRepo.remove({ userId, chatRoomId });
  await MessageService.createActionMessage({
    body: `${currentUsername} has left the chat`,
    chat_room: chatRoomId,
  });
};

const getPageCount = async (chatRoomId: TIdQuery) => {
  const docCount = await ParticipantRepo.getCountInChatRoom(chatRoomId);

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  getByChatRoomId,
  addParticipant,
  removeParticipant,
  getPageCount,
} as const;
