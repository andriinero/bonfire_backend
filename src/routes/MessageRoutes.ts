import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticateJwt } from '@src/middlewares/authentication';
import MessageService from '@src/services/MessageService';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { IRes } from './types/express/misc';
import { IReqParams } from './types/types';
import { chatroomidParam } from './validators/ChatRoomValidation';

type TMessagePostBody = {
  user: string;
  body: string;
  reply: string;
};

const message_get_all = [
  authenticateJwt,
  chatroomidParam,
  asyncHandler(async (req: IReqParams<{ chatroomid: string }>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { chatroomid } = req.params;
      const messages = await MessageService.getAllByChatRoomId(chatroomid);

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

        const result = await MessageService.createOne(messageDetails);

        res.status(HttpStatusCodes.CREATED).json(result);
      }
    },
  ),
];

export default {
  message_get_all,
  message_post,
} as const;
