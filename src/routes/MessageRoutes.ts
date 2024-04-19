import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticate } from '@src/middlewares/authentication';
import MessageService from '@src/services/MessageService';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { IRes } from './types/express/misc';
import { IReq, IReqParams } from './types/types';
import { chatroomidParam } from './validators/ChatRoomValidation';

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
  asyncHandler(async (req: IReq<{ chatroomid: string }>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      res.sendStatus(HttpStatusCodes.CREATED);
    }
  }),
];

export default {
  message_get_all,
  message_post,
};
