import asyncHandler from 'express-async-handler';

import { authenticateJwt } from '@src/middlewares/authentication';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { IRes } from './types/express/misc';
import type { IReq, IReqParams, IReqQuery } from './types/types';

import ProfileService from '@src/services/ProfileService';

import validationUtils, { validate } from '@src/util/validationUtils';

// CONTACTS //

const contacts_get_all = [
  authenticateJwt,
  validate(validationUtils.queries.defaultQueriesSchema),
  asyncHandler(
    async (
      req: IReqQuery<{ username: string; limit: string; page: string }>,
      res: IRes,
    ) => {
      const queryOpts = { limit: +req.query.limit, page: +req.query.page };
      const query = { _id: req.user!._id, username: req.query.username };

      const participants = await ProfileService.getContacts(query, queryOpts);

      res.status(HttpStatusCodes.OK).json(participants);
    },
  ),
];

const contact_post = [
  authenticateJwt,
  asyncHandler(async (req: IReq<{ contactUsername: string }>, res: IRes) => {
    const currentUserId = req.user!._id;
    const { contactUsername } = req.body;

    await ProfileService.createContact(currentUserId, contactUsername);

    res.status(HttpStatusCodes.CREATED).json({ message: 'Contact created' });
  }),
];

const contacts_delete = [
  authenticateJwt,
  validate(validationUtils.params.userIdParamSchema),
  asyncHandler(async (req: IReqParams<{ userid: string }>, res: IRes) => {
    const currentUserId = req.user!._id;
    const { userid } = req.params;

    const participants = await ProfileService.deleteContact(
      currentUserId,
      userid,
    );

    res.status(HttpStatusCodes.OK).json(participants);
  }),
];

const contacts_page_count = [
  authenticateJwt,
  asyncHandler(async (req: IReq, res: IRes) => {
    const currentUserId = req.user!._id;

    const count = await ProfileService.getContactPageCount(currentUserId);

    res.status(HttpStatusCodes.OK).json(count);
  }),
];

export default {
  contacts_get_all,
  contacts_delete,
  contact_post,
  contacts_page_count,
} as const;
