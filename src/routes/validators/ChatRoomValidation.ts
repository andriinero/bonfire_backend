import { body, param } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import { IReq } from '../types/types';

export const chatroomidParam = param('chatroomid', 'Chat room id must be valid')
  .trim()
  .custom(isValidObjectId)
  .escape();

export const chatRoomNameBody = body('name', 'Chat room name must be valid')
  .trim()
  .optional()
  .isLength({ min: 3, max: 100 })
  .escape();

export const chatRoomParticipantIdBody = body(
  'participantId',
  'Participant id must be valid',
)
  .trim()
  .custom(isValidObjectId)
  .custom((value, { req }) => {
    const request = req as IReq;
    const userId = request.user?._id.toString();

    return value !== userId;
  })
  .escape();
