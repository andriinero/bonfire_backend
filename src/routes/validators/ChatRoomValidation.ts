import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';
import UserRepo from '@src/repos/UserRepo';
import { USER_NOT_FOUND_ERR } from '@src/services/AuthService';
import { body, param } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import { IReq } from '../types/types';

const chatroomidParam = param('chatroomid', 'Chat room id must be valid')
  .trim()
  .custom(isValidObjectId)
  .escape();

const chatRoomNameBody = body('name', 'Chat room name must be valid')
  .trim()
  .optional()
  .isLength({ min: 3, max: 100 })
  .escape();

const participantUsernameSanitizer = body(
  'participantUsername',
  'Participant username must be valid',
)
  .trim()
  // can't create chat where the only participant is user himself
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

export default {
  chatroomidParam,
  chatRoomNameBody,
  participantUsernameSanitizer,
} as const;
