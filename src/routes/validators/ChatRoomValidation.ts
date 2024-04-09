import { body, param } from 'express-validator';
import { isValidObjectId } from 'mongoose';

const chatroomidParam = param('chatroomid', 'Chat room id must be valid')
  .trim()
  .custom(isValidObjectId)
  .escape();

const chatRoomName = body('name', 'Chat room name must be valid')
  .trim()
  .isLength({ min: 3, max: 8 })
  .escape();

export default {
  chatroomidParam,
  chatRoomName,
};
