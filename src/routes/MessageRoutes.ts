import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticate } from '@src/middlewares/authentication';
import MessageService from '@src/services/MessageService';
import { MessageType } from '@src/types/MessageTypes';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { IRes } from './types/express/misc';
import { IReqParams } from './types/types';
import { chatroomidParam } from './validators/ChatRoomValidation';

type TMessagePostBody = {
  user: string;
  body: string;
  reply: string;
};

const message_get_all = [
  authenticate,
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
  authenticate,
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
        const userId = req.user!._id.toString();
        const { chatroomid } = req.params;
        const { body, reply } = req.body;

        const messageDetails = {
          chat_room: chatroomid,
          user: userId,
          body,
          reply,
          type: MessageType.MESSAGE,
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
};
