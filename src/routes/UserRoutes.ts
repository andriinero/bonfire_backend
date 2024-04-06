import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TUser } from '@src/models/User';
import UserService from '@src/services/UserService';
import asyncHandler from 'express-async-handler';
import { param, validationResult } from 'express-validator';
import { Types, isValidObjectId } from 'mongoose';
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
      const userObjectId = new Types.ObjectId(userid);

      const user = await UserService.getOne(userObjectId);

      res.status(HttpStatusCodes.OK).json(user);
    }
  }),
];

const post = [
  useridParamValidation,
  asyncHandler(async (req: IReq<{ user: TUser }>, res: IRes): Promise<void> => {
    const { user } = req.body;

    await UserService.createOne(user);

    res.status(HttpStatusCodes.CREATED).end();
  }),
];

const put = [
  useridParamValidation,
  asyncHandler(async (req: IReq<{ user: TUser }>, res: IRes): Promise<void> => {
    const { user } = req.body;

    await UserService.updateOne(user);

    res.status(HttpStatusCodes.OK).end();
  }),
];

export default { getAll, getOne, post, put };
