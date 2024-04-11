import { body, param } from 'express-validator';
import { isValidObjectId } from 'mongoose';

export const chatroomidParam = param('chatroomid', 'Chat room id must be valid')
  .trim()
  .custom(isValidObjectId)
  .escape();

export const chatRoomNameBody = body('name', 'Chat room name must be valid')
  .trim()
  .optional()
  .isLength({ min: 3, max: 8 })
  .escape();

export const chatRoomParticipantIdBody = body(
  'participantId',
  'Participant id must be valid',
)
  .trim()
  .custom(isValidObjectId)
  .escape();
