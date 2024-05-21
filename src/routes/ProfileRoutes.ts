import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticateJwt } from '@src/middlewares/authentication';
import ProfileService from '@src/services/ProfileService';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { IRes } from './types/express/misc';
import { IReq, IReqParams } from './types/types';
import ProfileValidation from './validators/ProfileValidation';
import Validation from './validators/Validation';

// ONLINE STATUS //

const online_status_put = [
  authenticateJwt,
  ProfileValidation.onlineStatusBody,
  asyncHandler(async (req: IReq<{ isOnline: boolean }>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { _id } = req.user!;
      const { isOnline } = req.body;

      await ProfileService.updateOnlineStatus(_id, isOnline);

      res.status(HttpStatusCodes.OK).json({ message: 'Online status updated' });
    }
  }),
];

// CONTACTS //

const contacts_get_all = [
  authenticateJwt,
  ...Validation.defaultQueries,
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
  ProfileValidation.contactUsernameSanitizer,
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

const contacts_page_count = [
  authenticateJwt,
  asyncHandler(async (req: IReq, res: IRes) => {
    const { _id } = req.user!;
    const count = await ProfileService.getContactPageCount(_id);

    res.status(HttpStatusCodes.OK).json(count);
  }),
];

export default {
  online_status_put,
  contacts_get_all,
  contacts_delete,
  contact_post,
  contacts_page_count,
} as const;
