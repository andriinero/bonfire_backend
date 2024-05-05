import { param } from 'express-validator';
import { isValidObjectId } from 'mongoose';

const useridParam = param('userid', 'User id must be valid')
  .trim()
  .custom(isValidObjectId)
  .escape();

export default {
  useridParam,
} as const;
