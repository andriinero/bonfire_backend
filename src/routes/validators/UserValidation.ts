import { body, param } from 'express-validator';
import { isValidObjectId } from 'mongoose';

const useridParam = param('userid', 'User id must be valid')
  .trim()
  .custom(isValidObjectId)
  .escape();

const userData = [
  body('username', 'Username must be valid')
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),
  body('email', 'Username must be valid')
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),
];

export default { useridParam, userData };
