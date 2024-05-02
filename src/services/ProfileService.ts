import { TUserPublic } from '@src/models/User';
import ContactsRepo from '@src/repos/ContactsRepo';
import { Types } from 'mongoose';

const getContacts = async (userId: Types.ObjectId): Promise<TUserPublic[]> => {
  const contacts = await ContactsRepo.getAll({ _id: userId });

  return contacts;
};

export default { getContacts } as const;
