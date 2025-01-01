import { NotificationType } from '@prisma/client';
import NotificationRepo from '@src/repos/NotificationRepo';
import { PaginationOptions } from '@src/types/QueryOptions';

type CreateOne = {
  receivers: string[];
  sender: string;
  body: string;
  type: NotificationType;
};

const getRecent = async (userId: string, opts: PaginationOptions) => {
  const notificatoins = await NotificationRepo.getAllByUserId(
    userId,
    {},
    {
      created: 'desc',
    },
  );

  return notificatoins;
};

const create = async ({ receivers, sender, body, type }: CreateOne) => {
  await NotificationRepo.createMany(
    receivers.map((id) => ({ receiverId: id, senderId: sender, body, type })),
  );
};

const dismiss = async () => {};

export default { getRecent, create, dismiss } as const;
