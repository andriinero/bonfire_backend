import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticateJwt } from '@src/middlewares/authentication';
import AuthService from '@src/services/AuthService';
import { formatValidationErrors } from '@src/util/misc';
import { validate } from '@src/util/validationUtils';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import AuthSchemas from './schemas/AuthSchemas';
import type { IRes } from './types/express/misc';
import type { IReq } from './types/types';

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
  asyncHandler(async (req: IReq, res: IRes) => {
    const userId = req.user!.id;
    const data = await AuthService.getAuthData(userId);

    res.status(HttpStatusCodes.OK).json(data);
  }),
];

const sign_in_post = [
  validate(AuthSchemas.body.signInDataSchema),
  asyncHandler(async (req: IReq<TSignInBody>, res: IRes) => {
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
] as any[];

const sign_up_post = [
  validate(AuthSchemas.body.signUpDataSchema),
  asyncHandler(async (req: IReq<TSignUpBody>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { username, email, password } = req.body;

      const signUpData = { username, email, password };

      await AuthService.signUp(signUpData);

      res
        .status(HttpStatusCodes.CREATED)
        .json({ message: 'User created', status: HttpStatusCodes.CREATED });
    }
  }),
] as any[];

export default { get, sign_in_post, sign_up_post } as const;
