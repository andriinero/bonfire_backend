import EnvVars from '@src/constants/EnvVars';
import { RouteError } from '@src/other/classes';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { TUserDTO } from '@src/repos/UserRepo';
import type { QueryOptions } from '@src/types/TQueryOptions';

import ContactRepo from '@src/repos/ContactRepo';
import UserRepo from '@src/repos/UserRepo';

import { USER_NOT_FOUND_ERR } from './AuthService';

const CONTACT_EXISTS_ERROR = 'Contact with this id already exists';

// ONLINE STATUS //

const updateOnlineStatus = async (userId: string, isOnline: boolean) => {
  const persists = await UserRepo.persistOne({ id: userId });

  if (!persists)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  await UserRepo.updateOne({ id: userId }, { isOnline: isOnline });
};

// CONTACTS //

const getContactsById = async (
  userId: string,
  opts: QueryOptions<TUserDTO>,
) => {
  const contacts = await ContactRepo.getAll({ id: userId }, opts);

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

  const contactExists = await ContactRepo.hasContactsWithIds(currentUserId, [
    newContact.id,
  ]);

  if (contactExists)
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, CONTACT_EXISTS_ERROR);

  if (currentUser.id === newContact.id)
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      "You can't add yourself as a contact",
    );

  await ContactRepo.add(currentUser.id, newContact.id);
};

const deleteContact = async (currentUserId: string, contactId: string) => {
  const user = await UserRepo.getOne({ id: currentUserId });
  if (!user)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  const contactExists = await ContactRepo.hasContactsWithIds(currentUserId, [
    contactId,
  ]);
  if (!contactExists)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  await ContactRepo.removeByUserId(currentUserId, contactId);
};

const getContactPageCount = async (userId: string) => {
  const docCount = await ContactRepo.getCountByUserId(userId);

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  updateOnlineStatus,
  getContactsById,
  createContact,
  deleteContact,
  getContactPageCount,
} as const;
