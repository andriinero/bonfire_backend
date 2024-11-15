import EnvVars from '@src/constants/EnvVars';
import ContactExistsError from '@src/other/errors/ContactExistsError';
import NotFoundError from '@src/other/errors/NotFoundError';
import SelfActionError from '@src/other/errors/SelfActionError';
import ContactRepo from '@src/repos/ContactRepo';
import UserRepo from '@src/repos/UserRepo';
import type { PaginationOptions } from '@src/types/QueryOptions';

type GetOptions = { username?: string } & PaginationOptions;

// ONLINE STATUS //

const updateOnlineStatus = async (userId: string, isOnline: boolean) => {
  const persists = await UserRepo.persistOne({ id: userId });
  if (!persists) throw new NotFoundError();

  await UserRepo.updateOne({ id: userId }, { isOnline: isOnline });
};

// CONTACTS //

const getRecommendedContactsById = async (userId: string) => {
  const contacts = await ContactRepo.getAll(userId);
  const contactIds = contacts?.map((c) => c.id);
  const recommendedContacts = await UserRepo.getAll(
    { id: { notIn: contactIds } },
    { limit: 5 },
  );

  return recommendedContacts;
};

const getContactsById = async (userId: string, opts?: GetOptions) => {
  const queriedUsername = opts?.username;
  const contacts = await ContactRepo.getAll(
    userId,
    { username: { contains: queriedUsername, mode: 'insensitive' } },
    opts,
  );

  return contacts;
};

const createContact = async (userId: string, contactUsername: string) => {
  const currentUser = await UserRepo.getOne({ id: userId });
  if (!currentUser) throw new NotFoundError();

  const newContact = await UserRepo.getOne({ username: contactUsername });
  if (!newContact) throw new NotFoundError();

  const isContactAlreadyAdded = await ContactRepo.hasContactsWithIds(userId, [
    newContact.id,
  ]);
  if (isContactAlreadyAdded) throw new ContactExistsError();

  if (currentUser.id === newContact.id) throw new SelfActionError();

  await ContactRepo.addById(currentUser.id, newContact.id);
};

const deleteContact = async (userId: string, contactId: string) => {
  const user = await UserRepo.getOne({ id: userId });
  if (!user) throw new NotFoundError();

  const contactExists = await ContactRepo.hasContactsWithIds(userId, [
    contactId,
  ]);
  if (!contactExists) throw new NotFoundError();

  await ContactRepo.removeByUserId(userId, contactId);
};

const getContactPageCount = async (userId: string) => {
  const docCount = await ContactRepo.getCountByUserId(userId);

  return Math.floor(docCount / EnvVars.Bandwidth.MAX_DOCS_PER_FETCH);
};

export default {
  updateOnlineStatus,
  getContactsById,
  getRecommendedContactsById,
  createContact,
  deleteContact,
  getContactPageCount,
} as const;
