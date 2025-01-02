import { NotificationType } from '@prisma/client';
import NotificationRepo from '@src/repos/NotificationRepo';
import { PaginationOptions } from '@src/types/QueryOptions';

type Create = {
  receivers: string[];
  sender: string;
  body: string;
  type: NotificationType;
};

const getRecentByReceiverId = async (
  receiverId: string,
  opts: PaginationOptions,
) => {
  const notificatoins = await NotificationRepo.getAllByReceiverId(
    receiverId,
    {
      created: 'desc',
    },
    opts,
  );

  return notificatoins;
};

const create = async ({ receivers, sender, body, type }: Create) => {
  await NotificationRepo.createMany(
    receivers.map((id) => ({ receiverId: id, senderId: sender, body, type })),
  );
};

const markAsReadById = async (id: string) => {
  await NotificationRepo.updateById(id, { isRead: true });
};

const dismissAllByReceiverId = async (id: string) => {
  await NotificationRepo.deleteManyByReceiverId(id);
};

const dismissOneById = async (id: string) => {
  await NotificationRepo.deleteById(id);
};

export default {
  getRecentByReceiverId,
  create,
  markAsReadById,
  dismissAllByReceiverId,
  dismissOneById,
} as const;
