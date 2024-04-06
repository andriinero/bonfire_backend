import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TUserMutable } from '@src/models/User';
import UserService from '@src/services/UserService';
import asyncHandler from 'express-async-handler';
import { body, param, validationResult } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import { IRes } from './types/express/misc';
import { IReq, IReqParams } from './types/types';

// TODO: move to middlewares folder
const useridParamValidation = param('userid', 'User id must be valid')
  .trim()
  .custom(isValidObjectId)
  .escape();

const getAll = [
  asyncHandler(async (_: IReq, res: IRes): Promise<void> => {
    const allUsers = await UserService.getAll();

    res.status(HttpStatusCodes.OK).json(allUsers);
  }),
];

const getOne = [
  useridParamValidation,
  asyncHandler(async (req: IReqParams<{ userid: string }>, res: IRes): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'Validation error', errors: errors.array() });
    } else {
      const { userid } = req.params;

      const user = await UserService.getOne(userid);

      res.status(HttpStatusCodes.OK).json(user);
    }
  }),
];

const post = [
  body('username', 'Username must be valid')
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),
  body('email', 'Username must be valid').trim().isLength({ min: 3, max: 100 }).escape(),
  asyncHandler(
    async (req: IReq<{ userData: TUserMutable }>, res: IRes): Promise<void> => {
      const { userData } = req.body;

      await UserService.createOne(userData);

      res.status(HttpStatusCodes.CREATED).end();
    },
  ),
];

const put = [
  useridParamValidation,
  body('username', 'Username must be valid')
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),
  body('email', 'Username must be valid').trim().isLength({ min: 3, max: 100 }).escape(),
  asyncHandler(
    async (
      req: IReqParams<{ userid: string }, { user: TUserMutable }>,
      res: IRes,
    ): Promise<void> => {
      const { user } = req.body;

      await UserService.updateOne(userid, user);

      res.status(HttpStatusCodes.OK).end();
    },
  ),
];

export default { getAll, getOne, post, put };
