import asyncHandler from 'express-async-handler';
import { Types } from 'mongoose';

import { authenticateJwt } from '@src/middlewares/authentication';
import { formatValidationErrors } from '@src/util/misc';
import { validationResult } from 'express-validator';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IRes } from './types/express/misc';
import { IReqParams } from './types/types';

import MessageService from '@src/services/MessageService';

import ChatRoomValidation from './validators/ChatRoomValidation';
import Validation, { validate } from './validators/Validation';

type TMessagePostBody = {
  user: string;
  body: string;
  reply: string;
};

const message_get_all = [
  authenticateJwt,
  ...Validation.queries.defaultQueriesValidators,
  validate(ChatRoomValidation.params.idParamSchema),
  asyncHandler(async (req: IReqParams<{ chatroomid: string }>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { chatroomid } = req.params;
      const opts = req.query;
      const messages = await MessageService.getAllByChatRoomId(
        chatroomid,
        opts,
      );

      res.status(HttpStatusCodes.OK).json(messages);
    }
  }),
];

const message_post = [
  authenticateJwt,
  asyncHandler(
    async (
      req: IReqParams<{ chatroomid: string }, TMessagePostBody>,
      res: IRes,
    ) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json(formatValidationErrors(errors));
      } else {
        const { chatroomid } = req.params;
        const { body, reply } = req.body;
        const userId = req.user!._id;
        const chatRoomId = new Types.ObjectId(chatroomid);
        const replyId = new Types.ObjectId(reply);

        const messageDetails = {
          chat_room: chatRoomId,
          user: userId,
          body,
          reply: replyId,
        };

        const result = await MessageService.createUserMessage(messageDetails);

        res.status(HttpStatusCodes.CREATED).json(result);
      }
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
