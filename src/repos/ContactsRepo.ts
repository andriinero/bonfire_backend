import EnvVars from '@src/constants/EnvVars';

import type { TUserSchema } from '@src/models/User';
import type { TUserDTO, TUserDTODocument } from '@src/repos/UserRepo';
import type { TIdQuery } from '@src/types/IdQuery';
import type { TQueryOptions } from '@src/types/TQueryOptions';
import type { FilterQuery, Types } from 'mongoose';

import User from '@src/models/User';

import { USER_DATA_SELECTION } from './UserRepo';

type TQuery = FilterQuery<TUserSchema>;

const getAll = async (query: TQuery, opts?: TQueryOptions<TUserDTO>) => {
  const user = (await User.findOne(query)
    .select('contacts')
    .populate({ path: 'contacts', select: USER_DATA_SELECTION })
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH)
    .exec()) as unknown as {
    contacts: TUserDTODocument[];
  };

  return user.contacts ?? [];
};

const add = async (userId: TIdQuery, contactId: Types.ObjectId) => {
  const currentUser = await User.findOne({ _id: userId });
  currentUser?.contacts.push(contactId);
  await currentUser?.save();
};

const remove = async (userId: TIdQuery, contactId: Types.ObjectId) => {
  const currentUser = await User.findOne({ _id: userId });
  const contactIndex = currentUser?.contacts.findIndex((c) =>
    c.equals(contactId),
  );
  if (typeof contactIndex !== 'undefined' && contactIndex > -1)
    currentUser?.contacts.splice(contactIndex, 1);

  await currentUser?.save();
};

const getCount = async (query: TQuery) => {
  const user = await User.findOne(query).exec();

  return user ? user.contacts.length : 0;
};

export default { getAll, add, remove, getCount } as const;
