import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import MessageService from '@src/services/MessageService';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { IRes } from './types/express/misc';
import { IReq } from './types/types';
import { chatroomidBody } from './validators/MessageValidation';

const message_get_all = [
  chatroomidBody,
  asyncHandler(async (req: IReq<{ chatroomid: string }>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { chatroomid } = req.body;
      const messages = await MessageService.getAllByChatRoomId(chatroomid);

      res.status(HttpStatusCodes.OK).json(messages);
    }
  }),
];

export default {
  message_get_all,
};
