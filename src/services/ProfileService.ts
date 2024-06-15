import EnvVars from '@src/constants/EnvVars';
import { RouteError } from '@src/other/classes';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { TUserPublic } from '@src/models/User';
import type { TQueryOptions } from '@src/types/TQueryOptions';
import type { Types } from 'mongoose';

import ContactsRepo from '@src/repos/ContactsRepo';
import UserRepo from '@src/repos/UserRepo';

import { USER_NOT_FOUND_ERR } from './AuthService';

const CONTACT_EXISTS_ERROR = 'Contact with this id already exists';

// ONLINE STATUS //

const updateOnlineStatus = async (
  userId: Types.ObjectId | string,
  isOnline: boolean,
) => {
  const persists = await UserRepo.persistOne({ _id: userId });

  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  await UserRepo.updateOne({ _id: userId }, { is_online: isOnline });
};

// CONTACTS //

const getContacts = async (
  userId: Types.ObjectId | string,
  query: TQueryOptions<TUserPublic>,
) => {
  const contacts = await ContactsRepo.getAll({ _id: userId }, query);

  return contacts;
};

const createContact = async (
  currentUserId: Types.ObjectId | string,
  contactUsername: string,
) => {
  const currentUser = await UserRepo.getOne({ _id: currentUserId });
  if (!currentUser)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  const newContact = await UserRepo.getOne({ username: contactUsername });
  if (!newContact)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  const contactExists = currentUser.contacts.some((c) =>
    c.equals(contactUsername),
  );
  if (contactExists)
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, CONTACT_EXISTS_ERROR);

  currentUser.contacts.push(newContact._id);
  await currentUser.save();
};

const deleteContact = async (
  currentUserId: Types.ObjectId | string,
  contactId: Types.ObjectId | string,
) => {
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

const getContactPageCount = async (userId: Types.ObjectId) => {
  const docCount = await ContactsRepo.getCount({ _id: userId });

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  updateOnlineStatus,
  getContacts,
  createContact,
  deleteContact,
  getContactPageCount,
} as const;
