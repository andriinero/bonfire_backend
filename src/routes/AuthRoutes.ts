import asyncHandler from 'express-async-handler';

import { authenticateJwt } from '@src/middlewares/authentication';
import { formatValidationErrors } from '@src/util/misc';
import { validationResult } from 'express-validator';
import { validate } from './validators/Validation';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import type { TUserSchema } from '@src/models/User';
import type { IRes } from './types/express/misc';
import type { IReq } from './types/types';

import AuthService from '@src/services/AuthService';

import AuthValidation from './validators/AuthValidation';

type TSignInBody = {
  email: string;
  password: string;
};

type TSignUpBody = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const get = [
  authenticateJwt,
  (req: IReq, res: IRes): void => {
    const user = req.user as TUserSchema;
    const data = AuthService.getAuthData(user);

    res.status(HttpStatusCodes.OK).json(data);
  },
];

const sign_in_post = [
  validate(AuthValidation.body.signInDataSchema),
  asyncHandler(async (req: IReq<TSignInBody>, res: IRes): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { email, password } = req.body;
      const token = await AuthService.signIn(email, password);

      res.status(HttpStatusCodes.OK).json({ message: 'Success', token });
    }
  }),
];

const sign_up_post = [
  validate(AuthValidation.body.signUpDataSchema),
  asyncHandler(async (req: IReq<TSignUpBody>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { ...signUpBody } = req.body;

      await AuthService.signUp(signUpBody);

      res
        .status(HttpStatusCodes.CREATED)
        .json({ message: 'User created', status: HttpStatusCodes.CREATED });
    }
  }),
];

export default { get, sign_in_post, sign_up_post } as const;
