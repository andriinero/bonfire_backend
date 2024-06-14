import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';

import { authenticateJwt } from '@src/middlewares/authentication';
import { formatValidationErrors } from '@src/util/misc';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IRes } from './types/express/misc';
import { IReq, IReqParams } from './types/types';

import ProfileService from '@src/services/ProfileService';

import ProfileValidation from './validators/ProfileValidation';
import Validation from './validators/Validation';

// CONTACTS //

const contacts_get_all = [
  authenticateJwt,
  ...Validation.queries.defaultQueriesValidators,
  asyncHandler(async (req: IReq, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { _id } = req.user!;
      const query = req.query;
      const participants = await ProfileService.getContacts(_id, query);

      res.status(HttpStatusCodes.OK).json(participants);
    }
  }),
];

const contact_post = [
  authenticateJwt,
  ProfileValidation.stanitizers.checkUsernameOwnershipAndTransformToObjectId,
  asyncHandler(
    async (req: IReq<{ contactUsername: Types.ObjectId }>, res: IRes) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json(formatValidationErrors(errors));
      } else {
        const { _id } = req.user!;
        const { contactUsername: contactId } = req.body;
        await ProfileService.createContact(_id, contactId);

        res
          .status(HttpStatusCodes.CREATED)
          .json({ message: 'Contact created' });
      }
    },
  ),
];

const contacts_delete = [
  authenticateJwt,
  Validation.params.validateUserIdParam,
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

const contacts_page_count = [
  authenticateJwt,
  asyncHandler(async (req: IReq, res: IRes) => {
    const { _id } = req.user!;
    const count = await ProfileService.getContactPageCount(_id);

    res.status(HttpStatusCodes.OK).json(count);
  }),
];

export default {
  contacts_get_all,
  contacts_delete,
  contact_post,
  contacts_page_count,
} as const;
