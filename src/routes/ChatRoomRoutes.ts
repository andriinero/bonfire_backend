import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticate } from '@src/middlewares/authentication';
import { TChatRoomMutableData } from '@src/repos/ChatRoomRepo';
import ChatRoomService from '@src/services/ChatRoomService';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { IRes } from './types/express/misc';
import { IReq, IReqParams } from './types/types';
import {
  chatRoomNameBody,
  chatRoomParticipantIdBody,
  chatroomidParam,
} from './validators/ChatRoomValidation';

export type TChatRoomPost = {
  name: string;
  participant: string;
};

export type TChatRoomPut = {
  chatroomid: string;
};

const chat_room_get_all = [
  authenticate,
  asyncHandler(async (req: IReq, res: IRes): Promise<void> => {
    const { _id } = req.user!;
    const userId = _id.toString();

    const allChatRooms = await ChatRoomService.getAll(userId);

    res.status(HttpStatusCodes.OK).json(allChatRooms);
  }),
];

const chat_room_get_one = [
  authenticate,
  chatroomidParam,
  asyncHandler(
    async (
      req: IReqParams<{ chatroomid: string }>,
      res: IRes,
    ): Promise<void> => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json(formatValidationErrors(errors));
      } else {
        const { chatroomid } = req.params;
        const { _id } = req.user!._id;

        const roomId = chatroomid;
        const userId = _id.toString();

        const query = {
          roomId,
          userId,
        };

        const allChatRooms = await ChatRoomService.getOne(query);

        res.status(HttpStatusCodes.OK).json(allChatRooms);
      }
    },
  ),
];

const chat_room_post = [
  authenticate,
  chatRoomNameBody,
  chatRoomParticipantIdBody,
  asyncHandler(async (req: IReq<TChatRoomPost>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const user = req.user!;
      const { name, participant } = req.body;

      const userId = user._id.toString();
      const participantId = participant;

      const chatRoomDetails = { name, participants: [userId, participantId] };

      await ChatRoomService.createOne(chatRoomDetails);

      res.sendStatus(HttpStatusCodes.OK);
    }
  }),
];

const chat_room_put = [
  authenticate,
  chatroomidParam,
  chatRoomNameBody,
  chatRoomParticipantIdBody,
  asyncHandler(
    async (req: IReqParams<TChatRoomPut, TChatRoomMutableData>, res: IRes) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json(formatValidationErrors(errors));
      } else {
        const { _id } = req.user!;
        const { chatroomid } = req.params;
        const { name } = req.body;

        const roomId = chatroomid;
        const userId = _id.toString();

        const query = { roomId, userId };
        const chatRoomDetails = { name };

        await ChatRoomService.updateOne(query, chatRoomDetails);

        res.sendStatus(HttpStatusCodes.OK);
      }
    },
  ),
];

export default {
  chat_room_get_all,
  chat_room_get_one,
  chat_room_post,
  chat_room_put,
};
