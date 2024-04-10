import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticate } from '@src/middlewares/authentication';
import { TChatRoomMutableData, TChatRoomQuery } from '@src/repos/ChatRoomRepo';
import ChatRoomService from '@src/services/ChatRoomService';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { IRes } from './types/express/misc';
import { IReq, IReqParams } from './types/types';
import ChatRoomValidation from './validators/ChatRoomValidation';

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
    const userId = _id;

    const allChatRooms = await ChatRoomService.getAll(userId);

    res.status(HttpStatusCodes.OK).json(allChatRooms);
  }),
];

const chat_room_get_one = [
  authenticate,
  ChatRoomValidation.chatroomidParam,
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

        const chatRoomId = new Types.ObjectId(chatroomid);
        const userId = _id;

        const query: TChatRoomQuery = {
          _id: chatRoomId,
          participants: userId,
        };

        const allChatRooms = await ChatRoomService.getOneById(query);

        res.status(HttpStatusCodes.OK).json(allChatRooms);
      }
    },
  ),
];

const chat_room_post = [
  authenticate,
  ChatRoomValidation.chatRoomName,
  asyncHandler(async (req: IReq<TChatRoomPost>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { name, participant } = req.body;
      const userId = req.user!._id;
      const participantId = new Types.ObjectId(participant);

      const chatRoomDetails = { name, participants: [userId, participantId] };

      await ChatRoomService.createOne(chatRoomDetails);

      res.sendStatus(HttpStatusCodes.OK);
    }
  }),
];

const chat_room_put = [
  authenticate,
  ChatRoomValidation.chatroomidParam,
  ChatRoomValidation.chatRoomName,
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

        const chatRoomId = new Types.ObjectId(chatroomid);
        const userId = _id;

        const query = { _id: chatRoomId, participants: userId };
        const chatRoomDetails = { name };

        await ChatRoomService.updateOneById(query, chatRoomDetails);

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
