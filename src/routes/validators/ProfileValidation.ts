import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';
import UserRepo from '@src/repos/UserRepo';
import { USER_NOT_FOUND_ERR } from '@src/services/AuthService';
import { body } from 'express-validator';
import { IReq } from '../types/types';

const contactUsernameSanitizer = body(
  'contactUsername',
  'Contact username must be valid',
)
  .trim()
  // can't create a contact of himself
  .custom((contactUsername, { req }) => {
    const request = req as IReq;
    const userUsername = request.user?.username;

    return contactUsername !== userUsername;
  })
  .customSanitizer(async (contactUsername: string) => {
    const contact = await UserRepo.getOne({
      username: contactUsername,
    });

    if (!contact)
      throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

    return contact?._id;
  })
  .escape();

export default {
  contactUsernameSanitizer,
} as const;
