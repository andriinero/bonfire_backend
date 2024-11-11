import prisma from '@src/prisma';

import EnvVars from '@src/constants/EnvVars';

import type { TUserDTO } from '@src/repos/UserRepo';
import type { TQueryOptions } from '@src/types/TQueryOptions';

const getAllByChatRoomId = async (
  chatRoomId: string,
  opts?: TQueryOptions<TUserDTO>,
) => {
  const limit = opts?.limit;
  const skip = opts?.page ?? 0 * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH;

  const chatRoom = await prisma.chatroom.findUnique({
    where: { id: chatRoomId },
    select: { participtants: { take: limit, skip } },
  });

  return chatRoom?.participtants ?? [];
};

const addById = async (userId: string, chatRoomId: string) => {
  await prisma.chatroom.update({
    where: { id: chatRoomId },
    data: { participtants: { connect: { id: userId } } },
  });
};

const removeById = async (userId: string, chatRoomId: string) => {
  await prisma.chatroom.update({
    where: { id: chatRoomId },
    data: { participtants: { disconnect: { id: userId } } },
  });
};

const persistsInChatRoomById = async (userId: string, chatRoomId: string) => {
  const participant = await prisma.chatroom.findUnique({
    where: { id: chatRoomId, participtants: { some: { id: userId } } },
  });

  return !!participant;
};

const getCountById = async (chatRoomId: string) => {
  const chatRoom = await prisma.chatroom.findUnique({
    where: { id: chatRoomId },
    select: { participtants: true },
  });

  return chatRoom ? chatRoom.participtants.length : 0;
};

export default {
  getAllByChatRoomId,
  addById,
  removeById,
  persistsInChatRoomById,
  getCountById,
} as const;
