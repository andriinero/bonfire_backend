import { Types } from 'mongoose';

import EnvVars from '@src/constants/EnvVars';
import { RouteError } from '@src/other/classes';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { TUserDTO } from '@src/repos/UserRepo';
import type { TIdQuery } from '@src/types/IdQuery';
import type { TQueryOptions } from '@src/types/TQueryOptions';

import ContactsRepo from '@src/repos/ContactsRepo';
import UserRepo from '@src/repos/UserRepo';

import { USER_NOT_FOUND_ERR } from './AuthService';

const CONTACT_EXISTS_ERROR = 'Contact with this id already exists';

// ONLINE STATUS //

const updateOnlineStatus = async (userId: string, isOnline: boolean) => {
  const persists = await UserRepo.persistOne({ id: userId });

  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  await UserRepo.updateOne({ id: userId }, { is_online: isOnline });
};

// CONTACTS //

const getContacts = async (
  query: { _id?: TIdQuery; username?: string },
  opts: TQueryOptions<TUserDTO>,
) => {
  const contacts = await ContactsRepo.getAll(query, opts);

  return contacts;
};

const createContact = async (
  currentUserId: string,
  contactUsername: string,
) => {
  const currentUser = await UserRepo.getOne({ id: currentUserId });
  if (!currentUser)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  const newContact = await UserRepo.getOne({ username: contactUsername });
  if (!newContact)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  const contactExists = currentUser.contactIds.some((c) => c === newContact.id);

  if (contactExists)
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, CONTACT_EXISTS_ERROR);

  if (currentUser.id === newContact.id)
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      "You can't add yourself as a contact",
    );

  await ContactsRepo.add(currentUser.id, newContact.id);
};

const deleteContact = async (currentUserId: string, contactId: string) => {
  const user = await UserRepo.getOne({ id: currentUserId });
  if (!user) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  const foundContactIndex = user.contactIds.findIndex((c) => c === contactId);
  if (foundContactIndex < 0)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  await ContactsRepo.remove(user.id, new Types.ObjectId(contactId));
};

const getContactPageCount = async (userId: TIdQuery) => {
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
