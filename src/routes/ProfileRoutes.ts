import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticateJwt } from '@src/middlewares/authentication';
import ProfileService from '@src/services/ProfileService';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { IRes } from './types/express/misc';
import { IReq, IReqParams } from './types/types';
import Validation from './validators/Validation';

const contacts_get_all = [
  authenticateJwt,
  asyncHandler(async (req: IReq, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { _id } = req.user!;
      const participants = await ProfileService.getContacts(_id);

      res.status(HttpStatusCodes.OK).json(participants);
    }
  }),
];

const contacts_delete = [
  authenticateJwt,
  Validation.useridParam,
  asyncHandler(async (req: IReqParams<{ userid: string }>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { _id } = req.user!;
      const { userid: contactid } = req.params;
      const contactId = new Types.ObjectId(contactid);
      const participants = await ProfileService.deleteContact(_id, contactId);

      res.status(HttpStatusCodes.OK).json(participants);
    }
  }),
];

export default {
  contacts_get_all,
  contacts_delete,
};
