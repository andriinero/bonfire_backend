import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticate } from '@src/middlewares/authentication';
import ChatRoomService, { TChatQuery } from '@src/services/ChatRoomService';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import mongoose, { Types } from 'mongoose';
import { IRes } from './types/express/misc';
import { IReq, IReqParams } from './types/types';
import ChatRoomValidation from './validators/ChatRoomValidation';

const getAll = [
  authenticate,
  asyncHandler(async (req: IReq, res: IRes): Promise<void> => {
    const { _id } = req.user!;
    const userId = _id.toString();

    const allChatRooms = await ChatRoomService.getAll(userId);

    res.status(HttpStatusCodes.OK).json(allChatRooms);
  }),
];

const getOne = [
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

        const chatRoomId = new mongoose.Types.ObjectId(chatroomid);
        const userId = _id.toString();

        const query: TChatQuery = {
          _id: chatRoomId,
          participants: userId,
        };

        const allChatRooms = await ChatRoomService.getOneById(query);

        res.status(HttpStatusCodes.OK).json(allChatRooms);
      }
    },
  ),
];

const post = [
  authenticate,
  ChatRoomValidation.chatRoomName,
  asyncHandler(
    async (req: IReq<{ name: string; participant: string }>, res: IRes) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json(formatValidationErrors(errors));
      } else {
        const userId = req.user!._id;
        const { name, participant } = req.body;
        const participantId = new Types.ObjectId(participant);

        const chatRoomDetails = { name, participant: [userId, participantId] };

        await ChatRoomService.createOne(chatRoomDetails);

        res.sendStatus(HttpStatusCodes.OK);
      }
    },
  ),
];

const put = [
  authenticate,
  ChatRoomValidation.chatroomidParam,
  ChatRoomValidation.chatRoomName,
  asyncHandler(
    async (
      req: IReqParams<{ chatroomid: string }, { name: string }>,
      res: IRes,
    ) => {
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
        const userId = _id.toString();

        const query: TChatQuery = { _id: chatRoomId, participants: userId };
        const chatRoomDetails = { name };

        await ChatRoomService.updateOneById(query, chatRoomDetails);

        res.sendStatus(HttpStatusCodes.OK);
      }
    },
  ),
];

export default {
  getAll,
  getOne,
  post,
  put,
};
