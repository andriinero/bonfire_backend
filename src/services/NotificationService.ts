import NotificationRepo from '@src/repos/NotificationRepo';
import { PaginationOptions } from '@src/types/QueryOptions';

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

const dismiss = async () => {};

export default { getRecent, dismiss } as const;
