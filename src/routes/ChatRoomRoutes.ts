import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticateJwt } from '@src/middlewares/authentication';
import ChatRoomService from '@src/services/ChatRoomService';
import { formatValidationErrors } from '@src/util/misc';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { IRes } from './types/express/misc';
import { IReq, IReqParams } from './types/types';
import ChatRoomValidation from './validators/ChatRoomValidation';
import Validation from './validators/Validation';

type TCharRoomParam = {
  chatroomid: string;
};

const chat_room_get_all = [
  authenticateJwt,
  ...Validation.defaultQueries,
  asyncHandler(async (req: IReq, res: IRes): Promise<void> => {
    const { _id } = req.user!;
    const userId = _id.toString();
    const query = req.query;

    const allChatRooms = await ChatRoomService.getChatRoomsByUserId(
      userId,
      query,
    );

    res.status(HttpStatusCodes.OK).json(allChatRooms);
  }),
];

const chat_room_get_one = [
  authenticateJwt,
  ChatRoomValidation.chatroomidParam,
  asyncHandler(
    async (req: IReqParams<TCharRoomParam>, res: IRes): Promise<void> => {
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

        const allChatRooms = await ChatRoomService.getChatRoomById(query);

        res.status(HttpStatusCodes.OK).json(allChatRooms);
      }
    },
  ),
];

const chat_room_post = [
  authenticateJwt,
  ChatRoomValidation.participantUsernameSanitizer,
  asyncHandler(
    async (req: IReq<{ participantUsername: Types.ObjectId }>, res: IRes) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json(formatValidationErrors(errors));
      } else {
        const user = req.user!;
        const currentUserId = user._id;
        const { participantUsername } = req.body;

        await ChatRoomService.createOne(currentUserId, participantUsername);

        res.sendStatus(HttpStatusCodes.OK);
      }
    },
  ),
];

const chat_room_count = [
  authenticateJwt,
  ChatRoomValidation.userIdBody,
  asyncHandler(async (req: IReq<{ userid: string }>, res: IRes) => {
    const { userid } = req.params;
    const count = await ChatRoomService.getChatRoomCount(userid);

    res.status(HttpStatusCodes.OK).json(count);
  }),
];

// PARTICIPANTS //

const participant_get_all = [
  authenticateJwt,
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
        await ChatRoomService.getParticipantsByChatRoomId(chatRoomId);

      res.status(HttpStatusCodes.OK).json(participants);
    }
  }),
];

const participant_count = [
  authenticateJwt,
  ChatRoomValidation.chatroomidParam,
  asyncHandler(async (req: IReqParams<{ chatroomid: string }>, res: IRes) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(formatValidationErrors(errors));
    } else {
      const { chatroomid } = req.params;
      const chatRoomId = new Types.ObjectId(chatroomid);

      const participantCount =
        await ChatRoomService.getParticipantCount(chatRoomId);

      res.status(HttpStatusCodes.OK).json(participantCount);
    }
  }),
];

export default {
  chat_room_get_all,
  chat_room_get_one,
  chat_room_post,
  participant_get_all,
  chat_room_count,
  participant_count,
} as const;
