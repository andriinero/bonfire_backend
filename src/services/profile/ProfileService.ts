import { Optional } from '@prisma/client/runtime/library';
import NotFoundError from '@src/other/errors/NotFoundError';
import UserRepo from '@src/repos/UserRepo';
import { ProfilePatch } from '@src/routes/schemas/ProfileSchemas';

const patchProfileByUserId = async (
  id: string,
  data: Optional<ProfilePatch>,
) => {
  return await UserRepo.updateOne({ id }, data);
};

const updateOnlineStatus = async (userId: string, isOnline: boolean) => {
  const persists = await UserRepo.persistOne({ id: userId });
  if (!persists) throw new NotFoundError();

  await UserRepo.updateOne({ id: userId }, { isOnline: isOnline });
};

export default { patchProfileByUserId, updateOnlineStatus } as const;
