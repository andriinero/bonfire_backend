import { body } from 'express-validator';
import { isValidObjectId } from 'mongoose';

export const chatroomidBody = body('chatroomid', 'Chat room id must be valid')
  .trim()
  .custom(isValidObjectId)
  .escape();
