/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

const userPassword = [
  body('password', 'Password must be valid')
    .trim()
    .isLength({ min: 8 })
    .escape(),
  body('confirmPassword', 'Passwords must match')
    .trim()
    .custom((value: string, { req }) => {
      return value === req.body.password;
    })
    .escape(),
];

export default { useridParam, userData, userPassword };
