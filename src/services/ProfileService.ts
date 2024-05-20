import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TUserPublic } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import ContactsRepo from '@src/repos/ContactsRepo';
import UserRepo from '@src/repos/UserRepo';
import { TQueryOptions } from '@src/types/TQueryOptions';
import { Types } from 'mongoose';
import { USER_NOT_FOUND_ERR } from './AuthService';

const CONTACT_EXISTS_ERROR = 'Contact with this id already exists';

// ONLINE STATUS //

const updateOnlineStatus = async (
  userId: Types.ObjectId,
  isOnline: boolean,
): Promise<void> => {
  const persists = await UserRepo.persistOne({ _id: userId });

  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  await UserRepo.updateOne({ _id: userId }, { is_online: isOnline });
};

// CONTACTS //

const getContacts = async (
  userId: Types.ObjectId,
  query: TQueryOptions<TUserPublic>,
): Promise<TUserPublic[]> => {
  const contacts = await ContactsRepo.getAll({ _id: userId }, query);

  return contacts;
};

const createContact = async (
  currentUserId: Types.ObjectId,
  contactId: Types.ObjectId,
): Promise<void> => {
  const currentUser = await UserRepo.getOne({ _id: currentUserId });

  if (!currentUser) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  const contactExists = currentUser.contacts.some((c) => c.equals(contactId));

  if (contactExists) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, CONTACT_EXISTS_ERROR);
  }

  currentUser.contacts.push(contactId);
  await currentUser.save();
};

const deleteContact = async (
  currentUserId: Types.ObjectId,
  contactId: Types.ObjectId,
): Promise<void> => {
  const user = await UserRepo.getOne({ _id: currentUserId });

  if (!user) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  const foundContactIndex = user.contacts.findIndex((c) =>
    c._id.equals(contactId),
  );

  if (foundContactIndex < 0) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  user.contacts.splice(foundContactIndex, 1);
  await user.save();
};

const getContactPageCount = async (userId: Types.ObjectId): Promise<number> => {
  const docCount = await ContactsRepo.getCount({ _id: userId });

  return docCount;
};

export default {
  updateOnlineStatus,
  getContacts,
  createContact,
  deleteContact,
  getContactPageCount,
} as const;
