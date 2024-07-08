import EnvVars from '@src/constants/EnvVars';

import type { TUser, TUserPublic, TUserPublicDocument } from '@src/models/User';
import type { TQueryOptions } from '@src/types/TQueryOptions';
import type { FilterQuery } from 'mongoose';

import User, { USER_DATA_SELECTION } from '@src/models/User';

type TQuery = FilterQuery<TUser>;

const getAll = async (query: TQuery, opts?: TQueryOptions<TUserPublic>) => {
  const user = (await User.findOne(query)
    .select('contacts')
    .populate({ path: 'contacts', select: USER_DATA_SELECTION })
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH)
    .exec()) as unknown as {
    contacts: TUserPublicDocument[];
  };

  return user.contacts ?? [];
};

const getCount = async (query: TQuery) => {
  const user = await User.findOne(query).exec();

  return user ? user.contacts.length : 0;
};

export default { getAll, getCount } as const;
