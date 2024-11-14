import EnvVars from '@src/constants/EnvVars';
import NotFoundError from '@src/other/errors/NotFoundError';
import ParticipantExistsError from '@src/other/errors/ParticipantExists';
import ChatRoomRepo from '@src/repos/ChatRoomRepo';
import ParticipantRepo from '@src/repos/ParticipantRepo';
import UserRepo from '@src/repos/UserRepo';
import MessageService from './MessageService';

const PARTICIPANT_NOT_FOUND_ERR = 'Participant not found';

const getByChatRoomId = async (chatRoomId: string) => {
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
  if (!participant) throw new NotFoundError();
  const chatRoom = await ChatRoomRepo.getOneById(chatRoomId);
  if (!chatRoom) throw new NotFoundError();
  const participantPersists = await ParticipantRepo.persistsInChatRoomById(
    participant.id,
    chatRoom.id,
  );
  if (participantPersists) throw new ParticipantExistsError();

  await ParticipantRepo.addById(participant.id, chatRoom.id);
  await MessageService.createActionMessage({
    body: `${currentUsername} has added ${participant.username}`,
    chatRoomId: chatRoom.id,
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
  if (!userPersists) throw new NotFoundError();
  const chatRoomPersists = await ChatRoomRepo.persists({ id: chatRoomId });
  if (!chatRoomPersists) throw new NotFoundError();

  const participantPersists = await ParticipantRepo.persistsInChatRoomById(
    userId,
    chatRoomId,
  );
  if (!participantPersists) throw new NotFoundError();

  await ParticipantRepo.removeById(userId, chatRoomId);
  await MessageService.createActionMessage({
    body: `${currentUsername} has left the chat`,
    chatRoomId,
  });
};

const getPageCount = async (chatRoomId: string) => {
  const docCount = await ParticipantRepo.getCountById(chatRoomId);

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  getByChatRoomId,
  addParticipant,
  removeParticipant,
  getPageCount,
} as const;
