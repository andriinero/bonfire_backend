import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TUserPublic } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import ContactsRepo from '@src/repos/ContactsRepo';
import UserRepo from '@src/repos/UserRepo';
import { Types } from 'mongoose';
import { USER_NOT_FOUND_ERR } from './AuthService';

const CONTACT_EXSITS_ERROR = 'Contact with this id already exists';

const getContacts = async (userId: Types.ObjectId): Promise<TUserPublic[]> => {
  const contacts = await ContactsRepo.getAll({ _id: userId });

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

  const contactExsits = currentUser.contacts.some((c) => c.equals(contactId));

  if (contactExsits) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, CONTACT_EXSITS_ERROR);
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

export default { getContacts, createContact, deleteContact } as const;
