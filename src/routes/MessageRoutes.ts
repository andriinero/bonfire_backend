import asyncHandler from 'express-async-handler';

import { authenticateJwt } from '@src/middlewares/authentication';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { IRes } from './types/express/misc';
import type { IReqParams } from './types/types';

import MessageService from '@src/services/MessageService';

import validationUtils, { validate } from '@src/util/validationUtils';
import ChatRoomValidation from './schemas/ChatRoomSchemas';

type TMessagePostBody = {
  user: string;
  body: string;
  reply: string;
};

const message_get_all = [
  authenticateJwt,
  validate(ChatRoomValidation.params.idParamSchema),
  validate(validationUtils.queries.defaultQueriesSchema),
  asyncHandler(async (req: IReqParams<{ chatroomid: string }>, res: IRes) => {
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
      req: IReqParams<{ chatroomid: string }, TMessagePostBody>,
      res: IRes,
    ) => {
      const { chatroomid } = req.params;
      const { body, reply } = req.body;
      const currentUserId = req.user!._id;

      const messageDetails = {
        chat_room: chatroomid,
        user: currentUserId,
        body,
        reply,
      };

      const result = await MessageService.createUserMessage(messageDetails);

      res.status(HttpStatusCodes.CREATED).json(result);
    },
  ),
];

const message_page_count = [
  authenticateJwt,
  asyncHandler(async (req: IReqParams<{ chatroomid: string }>, res: IRes) => {
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
