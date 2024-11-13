import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticateJwt } from '@src/middlewares/authentication';
import ProfileService from '@src/services/ProfileService';
import validationUtils, { validate } from '@src/util/validationUtils';
import asyncHandler from 'express-async-handler';
import type { IRes } from './types/express/misc';
import type { Req, ReqParams, ReqQuery } from './types/types';

// CONTACTS //

const contacts_get_all = [
  authenticateJwt,
  validate(validationUtils.queries.pageQueriesSchema),
  asyncHandler(
    async (
      req: ReqQuery<{ username: string; limit: string; page: string }>,
      res: IRes,
    ) => {
      const currentUserId = req.user!.id;
      const queryOpts = {
        username: req.query.username,
        limit: +req.query.limit,
        page: +req.query.page,
      };

      const participants = await ProfileService.getContactsById(
        currentUserId,
        queryOpts,
      );

      res.status(HttpStatusCodes.OK).json(participants);
    },
  ),
];

const contact_post = [
  authenticateJwt,
  asyncHandler(async (req: Req<{ contactUsername: string }>, res: IRes) => {
    const currentUserId = req.user!.id;
    const { contactUsername } = req.body;

    await ProfileService.createContact(currentUserId, contactUsername);

    res.status(HttpStatusCodes.CREATED).json({ message: 'Contact created' });
  }),
];

const contacts_delete = [
  authenticateJwt,
  validate(validationUtils.params.userIdParamSchema),
  asyncHandler(async (req: ReqParams<{ userid: string }>, res: IRes) => {
    const currentUserId = req.user!.id;
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
  asyncHandler(async (req: Req, res: IRes) => {
    const currentUserId = req.user!.id;

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
