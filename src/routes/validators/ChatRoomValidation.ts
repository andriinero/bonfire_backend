import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';
import UserRepo from '@src/repos/UserRepo';
import { USER_NOT_FOUND_ERR } from '@src/services/AuthService';
import { body as reqBody, param as reqParam } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import { IReq } from '../types/types';

const validateIdParam = reqParam('chatroomid', 'Chat room id must be valid')
  .trim()
  .custom(isValidObjectId)
  .escape();

const validateNameBody = reqBody('name', 'Chat room name must be valid')
  .trim()
  .optional()
  .isLength({ min: 3, max: 100 })
  .escape();

const checkUsernameOwnershipAndTransformToObjectId = reqBody(
  'participantUsername',
  'Participant username must be valid',
)
  .trim()
  // can't create chat with the user himself
  .custom((participantUsername, { req }) => {
    const request = req as IReq;
    const userUsername = request.user?.username;

    return participantUsername !== userUsername;
  })
  .customSanitizer(async (participantUsername: string) => {
    const participant = await UserRepo.getOne({
      username: participantUsername,
    });

    if (!participant)
      throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

    return participant?._id;
  })
  .escape();

const validateUserIdBody = [
  reqBody('userid').trim().custom(isValidObjectId).escape(),
];

const body = { validateNameBody, validateUserIdBody };

const params = { validateIdParam };

const sanitizers = { checkUsernameOwnershipAndTransformToObjectId };

export default {
  body,
  params,
  sanitizers,
} as const;
