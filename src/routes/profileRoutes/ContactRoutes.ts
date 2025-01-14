import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticate } from '@src/middlewares/authentication';
import ContactService from '@src/services/profile/ContactService';
import validationUtils, { validate } from '@src/util/validationUtils';
import asyncHandler from 'express-async-handler';
import { Req, ReqParams, ReqQuery } from '../types/types';

const contacts_get_all = [
  authenticate,
  validate(validationUtils.queries.paginationQueriesSchema),
  asyncHandler(
    async (
      req: ReqQuery<{ username: string; limit: string; page: string }>,
      res,
    ) => {
      const currentUserId = req.user!.id;
      const queryOpts = {
        username: req.query.username,
        limit: +req.query.limit,
        page: +req.query.page,
      };

      const participants = await ContactService.getContactsByUsername(
        currentUserId,
        queryOpts,
      );

      res.status(HttpStatusCodes.OK).json(participants);
    },
  ),
];

const contacts_get_recommended = [
  authenticate,
  asyncHandler(async (req: Req, res) => {
    const currentUserId = req.user!.id;

    const recommendedConctacts =
      await ContactService.getRecommendedContactsById(currentUserId);

    res.status(HttpStatusCodes.OK).json(recommendedConctacts);
  }),
];

const contact_post = [
  authenticate,
  asyncHandler(async (req: Req<{ contactUsername: string }>, res) => {
    const currentUserId = req.user!.id;
    const { contactUsername } = req.body;

    await ContactService.createContact(currentUserId, contactUsername);

    res.status(HttpStatusCodes.CREATED).json({ message: 'Contact created' });
  }),
];

const contacts_delete = [
  authenticate,
  asyncHandler(async (req: ReqParams<{ userid: string }>, res) => {
    const currentUserId = req.user!.id;
    const { userid } = req.params;

    const participants = await ContactService.deleteContact(
      currentUserId,
      userid,
    );

    res.status(HttpStatusCodes.OK).json(participants);
  }),
];

const contacts_page_count = [
  authenticate,
  asyncHandler(async (req: Req, res) => {
    const currentUserId = req.user!.id;

    const count = await ContactService.getContactPageCount(currentUserId);

    res.status(HttpStatusCodes.OK).json(count);
  }),
];

export default {
  contacts_get_all,
  contacts_get_recommended,
  contacts_delete,
  contact_post,
  contacts_page_count,
} as const;
