import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';

import { authenticateJwt } from '@src/middlewares/authentication';
import { formatValidationErrors } from '@src/util/misc';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IRes } from './types/express/misc';
import { IReq, IReqParams } from './types/types';

import ChatRoomService from '@src/services/ChatRoomService';
import ChatRoomParticipantService from '@src/services/ParticipantService';

import ChatRoomValidation from './validators/ChatRoomValidation';
import Validation from './validators/Validation';

type TCharRoomParam = {
  chatroomid: string;
};

const chat_room_get_all = [
  authenticateJwt,
  ...Validation.queries.defaultQueriesValidators,
  asyncHandler(async (req: IReq, res: IRes): Promise<void> => {
    const { _id } = req.user!;
    const userId = _id.toString();
    const query = req.query;

    const allChatRooms = await ChatRoomService.getByUserId(userId, query);

    res.status(HttpStatusCodes.OK).json(allChatRooms);
  }),
];

const chat_room_get_one = [
  authenticateJwt,
  ChatRoomValidation.params.validateIdParam,
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

        const allChatRooms = await ChatRoomService.getById(query);

        res.status(HttpStatusCodes.OK).json(allChatRooms);
      }
    },
  ),
];

const chat_room_post = [
  authenticateJwt,
  ChatRoomValidation.sanitizers.checkUsernameOwnershipAndTransformToObjectId,
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

const chat_room_page_count = [
  authenticateJwt,
  asyncHandler(async (req: IReq, res: IRes) => {
    const { _id } = req.user!;
    const userId = _id.toString();
    const count = await ChatRoomService.getPageCount(userId);

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
        await ChatRoomParticipantService.getByChatRoomId(chatRoomId);

      res.status(HttpStatusCodes.OK).json(participants);
    }
  }),
];

const participant_post = [
  authenticateJwt,
  ChatRoomValidation.params.validateIdParam,
  ChatRoomValidation.sanitizers.checkUsernameOwnershipAndTransformToObjectId,
  asyncHandler(
    (
      req: IReqParams<
        { chatroomid: string },
        { participantUsername: Types.ObjectId }
      >,
      res: IRes,
    ) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json(formatValidationErrors(errors));
      } else {
        const { username } = req.user!;
        const { participantUsername: participantId } = req.body;
        const { chatroomid } = req.params;
        const chatRoomObjectId = new Types.ObjectId(chatroomid);

        ChatRoomParticipantService.addParticipant({
          currentUsername: username,
          participantId: participantId,
          chatRoomId: chatRoomObjectId,
        });

        res.status(HttpStatusCodes.OK).json({ message: 'Participant added' });
      }
    },
  ),
];

const participant_delete = [
  authenticateJwt,
  ChatRoomValidation.params.validateIdParam,
  asyncHandler(
    (
      req: IReqParams<
        { chatroomid: string },
        { participantUsername: Types.ObjectId }
      >,
      res: IRes,
    ) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json(formatValidationErrors(errors));
      } else {
        const { _id, username } = req.user!;
        const { chatroomid } = req.params;
        const chatRoomObjectId = new Types.ObjectId(chatroomid);

        ChatRoomParticipantService.removeParticipant({
          currentUsername: username,
          userId: _id,
          chatRoomId: chatRoomObjectId,
        });

        res.status(HttpStatusCodes.OK).json({ message: 'Participant removed' });
      }
    },
  ),
];

const participant_page_count = [
  authenticateJwt,
  ChatRoomValidation.params.validateIdParam,
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
        await ChatRoomParticipantService.getPageCount(chatRoomId);

      res.status(HttpStatusCodes.OK).json(participantCount);
    }
  }),
];

export default {
  chat_room_get_all,
  chat_room_get_one,
  chat_room_post,
  participant_get_all,
  participant_post,
  participant_delete,
  chat_room_page_count,
  participant_page_count,
} as const;
