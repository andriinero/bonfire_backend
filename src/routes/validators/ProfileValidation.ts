import { body as reqBody } from 'express-validator';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';
import { IReq } from '../types/types';

import UserRepo from '@src/repos/UserRepo';

import { USER_NOT_FOUND_ERR } from '@src/services/AuthService';

const checkUsernameOwnershipAndTransformToObjectId = reqBody(
  'contactUsername',
  'Contact username must be valid',
)
  .trim()
  // can't create a contact of himself
  .custom((value, { req }) => {
    const request = req as IReq;
    const userUsername = request.user?.username;

    return value !== userUsername;
  })
  .customSanitizer(async (contactUsername: string) => {
    const contact = await UserRepo.getOne({
      username: contactUsername,
    });

    if (!contact) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
    }

    return contact?._id;
  })
  .escape();

const stanitizers = { checkUsernameOwnershipAndTransformToObjectId };

export default { stanitizers } as const;
