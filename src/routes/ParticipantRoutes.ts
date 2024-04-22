import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import ParticipantService from '@src/services/ParticipantService';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { IRes } from './types/express/misc';
import { IReqParams } from './types/types';

const participant_get_all = [
  asyncHandler(async (req: IReqParams<{ chatroomid: string }>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { chatroomid } = req.params;
      const chatRoomId = new Types.ObjectId(chatroomid);

      const participants =
        await ParticipantService.getAllByChatRoomId(chatRoomId);

      res.status(HttpStatusCodes.OK).json(participants);
    }
  }),
];

export default { participant_get_all };
