import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticateJwt } from '@src/middlewares/authentication';
import { TUser } from '@src/models/User';
import AuthService from '@src/services/AuthService';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { IRes } from './types/express/misc';
import { IReq } from './types/types';
import { signInData, signUpData } from './validators/AuthValidation';

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
    const user = req.user as TUser;
    const data = AuthService.getAuthData(user);

    res.status(HttpStatusCodes.OK).json(data);
  },
];

const sign_in_post = [
  ...signInData,
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
  ...signUpData,
  asyncHandler(async (req: IReq<TSignUpBody>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { ...signUpBody } = req.body;

      await AuthService.signUp(signUpBody);

      res.sendStatus(HttpStatusCodes.OK);
    }
  }),
];

export default { get, sign_in_post, sign_up_post } as const;
