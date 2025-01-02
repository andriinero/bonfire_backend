import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticate } from '@src/middlewares/authentication';
import NotificationService from '@src/services/NotificationService';
import validationUtils, { validate } from '@src/util/validationUtils';
import asyncHandler from 'express-async-handler';
import { ReqParams, ReqQuery } from './types/types';

const get_all = [
  authenticate,
  validate(validationUtils.queries.paginationQueriesSchema),
  asyncHandler(async (req: ReqQuery<{ limit: string; page: string }>, res) => {
    const currentUserId = req.user!.id;
    const { limit, page } = req.query;
    const queryOpts = {
      limit: +limit,
      page: +page,
    };

    const notifications = await NotificationService.getRecent(
      currentUserId,
      queryOpts,
    );

    res.status(HttpStatusCodes.OK).json(notifications);
  }),
];

const delete_all = [
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    await NotificationService.dismissAllByReceiverId(userId);

    res
      .status(HttpStatusCodes.OK)
      .json({ message: 'All notifications dismissed' });
  }),
];

const delete_one = [
  authenticate,
  asyncHandler(async (req: ReqParams<{ notificationid: string }>, res) => {
    const { notificationid } = req.params;

    await NotificationService.dismissOneById(notificationid);

    res.status(HttpStatusCodes.OK).json({ message: 'Notification dismissed' });
  }),
];

export default {
  get_all,
  delete_all,
  delete_one,
} as const;
