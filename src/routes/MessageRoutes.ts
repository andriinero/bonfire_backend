import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticateJwt } from '@src/middlewares/authentication';
import MessageService from '@src/services/MessageService';
import validationUtils, { validate } from '@src/util/validationUtils';
import asyncHandler from 'express-async-handler';
import type { IRes } from './types/express/misc';
import type { ReqParams } from './types/types';

type MessagePostData = {
  user: string;
  body: string;
  reply: string;
};

const message_get_all = [
  authenticateJwt,
  validate(validationUtils.queries.pageQueriesSchema),
  asyncHandler(async (req: ReqParams<{ chatroomid: string }>, res: IRes) => {
    const { chatroomid } = req.params;
    const opts = req.query;

    const messages = await MessageService.getAllByChatRoomId(chatroomid, opts);

    res.status(HttpStatusCodes.OK).json(messages);
  }),
];

const message_post = [
  authenticateJwt,
  asyncHandler(
    async (
      req: ReqParams<{ chatroomid: string }, MessagePostData>,
      res: IRes,
    ) => {
      const currentUserId = req.user!.id;
      const { chatroomid } = req.params;
      const { body } = req.body;

      const messageDetails = {
        chatRoomId: chatroomid,
        userId: currentUserId,
        body,
      };

      const result = await MessageService.createUserMessage(messageDetails);

      res.status(HttpStatusCodes.CREATED).json(result);
    },
  ),
];

const message_page_count = [
  authenticateJwt,
  asyncHandler(async (req: ReqParams<{ chatroomid: string }>, res: IRes) => {
    const { chatroomid } = req.params;

    const count = await MessageService.getPageCountByChatRoomId(chatroomid);

    res.status(HttpStatusCodes.OK).json(count);
  }),
];

export default {
  message_get_all,
  message_post,
  message_page_count,
} as const;
