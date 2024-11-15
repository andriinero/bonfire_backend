import EnvVars from '@src/constants/EnvVars';
import prisma from '@src/prisma';
import type { PaginationOptions } from '@src/types/QueryOptions';

const getAllByChatRoomId = async (
  chatRoomId: string,
  opts?: PaginationOptions,
) => {
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;
  const limit = opts?.limit;

  const chatRoom = await prisma.chatroom.findUnique({
    where: { id: chatRoomId },
    select: { participants: { take: limit, skip } },
  });

  return chatRoom?.participants ?? [];
};

const addById = async (userId: string, chatRoomId: string) => {
  await prisma.chatroom.update({
    where: { id: chatRoomId },
    data: { participants: { connect: { id: userId } } },
  });
};

const removeById = async (userId: string, chatRoomId: string) => {
  await prisma.chatroom.update({
    where: { id: chatRoomId },
    data: { participants: { disconnect: { id: userId } } },
  });
};

const persistsInChatRoomById = async (userId: string, chatRoomId: string) => {
  const participant = await prisma.chatroom.findUnique({
    where: { id: chatRoomId, participants: { some: { id: userId } } },
  });

  return !!participant;
};

const getCountById = async (chatRoomId: string) => {
  const chatRoom = await prisma.chatroom.findUnique({
    where: { id: chatRoomId },
    select: { participants: true },
  });

  return chatRoom ? chatRoom.participants.length : 0;
};

export default {
  getAllByChatRoomId,
  addById,
  removeById,
  persistsInChatRoomById,
  getCountById,
} as const;
