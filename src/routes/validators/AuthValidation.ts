import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';
import UserRepo from '@src/repos/UserRepo';
import { body } from 'express-validator';
import { IReq } from '../types/types';

export const signInData = [
  body('email').trim().escape(),
  body('password').trim().escape(),
];

export const signUpData = [
  body('username', 'Username must be valid')
    .trim()
    .custom(async (value: string) => {
      const userByUsername = await UserRepo.persistOne({ username: value });

      if (userByUsername)
        throw new RouteError(
          HttpStatusCodes.BAD_REQUEST,
          'User with this username already exists',
        );
    })
    .escape(),
  body('email', 'Email must be valid')
    .trim()
    .isEmail()
    .custom(async (value: string) => {
      const userByEmail = await UserRepo.persistOne({ email: value });

      if (userByEmail)
        throw new RouteError(
          HttpStatusCodes.BAD_REQUEST,
          'User with this email already exists',
        );
    })
    .escape(),
  body('password').trim().escape(),
  body('confirmPassword', "Passwords don't match")
    .trim()
    .custom((value: string, { req }) => {
      const request = req as IReq<{ password: string }>;

      return value === request.body.password;
    })
    .escape(),
];
