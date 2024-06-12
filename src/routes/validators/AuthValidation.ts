import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '@src/other/classes';
import UserRepo from '@src/repos/UserRepo';
import { body as reqBody } from 'express-validator';
import { IReq } from '../types/types';

const signInDataValidators = [
  reqBody('email').trim().escape(),
  reqBody('password').trim().escape(),
];

const signUpDataValidators = [
  reqBody('username', 'Username must be valid')
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
  reqBody('email', 'Email must be valid')
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
  reqBody('password').trim().escape(),
  reqBody('confirmPassword', "Passwords don't match")
    .trim()
    .custom((value: string, { req }) => {
      const request = req as IReq<{ password: string }>;

      return value === request.body.password;
    })
    .escape(),
];

const body = { signInDataValidators, signUpDataValidators };

export default { body } as const;
