import asyncHandler from 'express-async-handler';

import { authenticateJwt } from '@src/middlewares/authentication';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { IRes } from './types/express/misc';
import type { IReq, IReqParams } from './types/types';

import ChatRoomService from '@src/services/ChatRoomService';
import ParticipantService from '@src/services/ParticipantService';

import ChatRoomValidation from './validators/ChatRoomValidation';
import Validation, { validate } from './validators/Validation';

type TCharRoomParam = {
  chatroomid: string;
};

const chat_room_get_all = [
  authenticateJwt,
  ...Validation.queries.defaultQueriesValidators,
  asyncHandler(async (req: IReq, res: IRes): Promise<void> => {
    const currentUserId = req.user!._id;
    const query = req.query;

    const allChatRooms = await ChatRoomService.getByUserId(
      currentUserId,
      query,
    );

    res.status(HttpStatusCodes.OK).json(allChatRooms);
  }),
];

const chat_room_get_one = [
  authenticateJwt,
  validate(ChatRoomValidation.params.idParamSchema),
  asyncHandler(
    async (req: IReqParams<TCharRoomParam>, res: IRes): Promise<void> => {
      const currentUserId = req.user!._id;
      const { chatroomid } = req.params;

      const query = {
        userId: currentUserId,
        roomId: chatroomid,
      };

      const allChatRooms = await ChatRoomService.getById(query);

      res.status(HttpStatusCodes.OK).json(allChatRooms);
    },
  ),
];

const chat_room_post = [
  authenticateJwt,
  validate(Validation.usernameOwnership('participantUsername')),
  asyncHandler(
    async (req: IReq<{ participantUsername: string }>, res: IRes) => {
      const currentUserId = req.user!._id;
      const { participantUsername } = req.body;

      await ChatRoomService.createOne(currentUserId, participantUsername);

      res.status(HttpStatusCodes.OK).json({ message: 'Chat room created' });
    },
  ),
];

const chat_room_page_count = [
  authenticateJwt,
  asyncHandler(async (req: IReq, res: IRes) => {
    const currentUserId = req.user!._id;

    const count = await ChatRoomService.getPageCount(currentUserId);

    res.status(HttpStatusCodes.OK).json(count);
  }),
];

// PARTICIPANTS //

const participant_get_all = [
  authenticateJwt,
  asyncHandler(async (req: IReqParams<{ chatroomid: string }>, res: IRes) => {
    const { chatroomid } = req.params;

    const participants = await ParticipantService.getByChatRoomId(chatroomid);

    res.status(HttpStatusCodes.OK).json(participants);
  }),
];

const participant_post = [
  authenticateJwt,
  validate(ChatRoomValidation.params.idParamSchema),
  validate(Validation.usernameOwnership('participantUsername')),
  asyncHandler(
    async (
      req: IReqParams<{ chatroomid: string }, { participantUsername: string }>,
      res: IRes,
    ) => {
      const { username } = req.user!;
      const { participantUsername } = req.body;
      const { chatroomid } = req.params;

      await ParticipantService.addParticipant({
        currentUsername: username,
        participantUsername,
        chatRoomId: chatroomid,
      });

      res.status(HttpStatusCodes.OK).json({ message: 'Participant added' });
    },
  ),
];

const participant_delete = [
  authenticateJwt,
  validate(ChatRoomValidation.params.idParamSchema),
  asyncHandler(async (req: IReqParams<{ chatroomid: string }>, res: IRes) => {
    const { _id, username } = req.user!;
    const { chatroomid } = req.params;

    await ParticipantService.removeParticipant({
      currentUsername: username,
      userId: _id,
      chatRoomId: chatroomid,
    });

    res.status(HttpStatusCodes.OK).json({ message: 'Participant removed' });
  }),
];

const participant_page_count = [
  authenticateJwt,
  validate(ChatRoomValidation.params.idParamSchema),
  asyncHandler(async (req: IReqParams<{ chatroomid: string }>, res: IRes) => {
    const { chatroomid } = req.params;

    const participantCount = await ParticipantService.getPageCount(chatroomid);

    res.status(HttpStatusCodes.OK).json(participantCount);
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
