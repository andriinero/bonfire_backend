import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TUserMutable } from '@src/models/User';
import UserService from '@src/services/UserService';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { IRes } from './types/express/misc';
import { IReq, IReqParams } from './types/types';
import UserValidation from './validators/UserValidation';

const getAll = [
  asyncHandler(async (_: IReq, res: IRes): Promise<void> => {
    const allUsers = await UserService.getAll();

    res.status(HttpStatusCodes.OK).json(allUsers);
  }),
];

const getOne = [
  UserValidation.useridParam,
  asyncHandler(
    async (req: IReqParams<{ userid: string }>, res: IRes): Promise<void> => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json(formatValidationErrors(errors));
      } else {
        const { userid } = req.params;

        const user = await UserService.getOne(userid);

        res.status(HttpStatusCodes.OK).json(user);
      }
    },
  ),
];

const post = [
  ...UserValidation.userData,
  ...UserValidation.userPassword,
  asyncHandler(
    async (
      req: IReq<{
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
      }>,
      res: IRes,
    ): Promise<void> => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json(formatValidationErrors(errors));
      } else {
        const { username, email, password, confirmPassword } = req.body;

        await UserService.createOne({
          username,
          email,
          password,
          confirmPassword,
        });

        res.sendStatus(HttpStatusCodes.CREATED);
      }
    },
  ),
];

const put = [
  UserValidation.useridParam,
  ...UserValidation.userData,
  asyncHandler(
    async (
      req: IReqParams<{ userid: string }, { user: TUserMutable }>,
      res: IRes,
    ): Promise<void> => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json(formatValidationErrors(errors));
      } else {
        const { userid } = req.params;
        const { user } = req.body;

        await UserService.updateOne(userid, user);

        res.sendStatus(HttpStatusCodes.OK);
      }
    },
  ),
];

export default { getAll, getOne, post, put };
