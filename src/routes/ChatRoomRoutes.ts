import asyncHandler from 'express-async-handler';

import { authenticateJwt } from '@src/middlewares/authentication';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { IRes } from './types/express/misc';
import type { Req, ReqParams } from './types/types';

import ChatRoomService from '@src/services/ChatRoomService';
import ParticipantService from '@src/services/ParticipantService';

import validationUtils, { validate } from '@src/util/validationUtils';
import ChatRoomSchemas from './schemas/ChatRoomSchemas';

type CharRoomParam = {
  chatroomid: string;
};

const chat_room_get_all = [
  authenticateJwt,
  validate(validationUtils.queries.pageQueriesSchema),
  asyncHandler(async (req: Req, res: IRes): Promise<void> => {
    const currentUserId = req.user!.id;
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
  validate(ChatRoomSchemas.params.idParamSchema),
  asyncHandler(
    async (req: ReqParams<CharRoomParam>, res: IRes): Promise<void> => {
      const currentUserId = req.user!.id;
      const { chatroomid } = req.params;

      const allChatRooms = await ChatRoomService.getById(
        currentUserId.toString(),
        chatroomid,
      );

      res.status(HttpStatusCodes.OK).json(allChatRooms);
    },
  ),
];

const chat_room_post = [
  authenticateJwt,
  validate(ChatRoomSchemas.body.contactIdsExistence),
  asyncHandler(async (req: Req<{ userIds: string[] }>, res: IRes) => {
    const currentUserId = req.user!.id;
    const { userIds } = req.body;

    await ChatRoomService.createOne(currentUserId, userIds);

    res.status(HttpStatusCodes.OK).json({ message: 'Chat room created' });
  }),
];

const chat_room_page_count = [
  authenticateJwt,
  asyncHandler(async (req: Req, res: IRes) => {
    const currentUserId = req.user!.id;

    const count = await ChatRoomService.getPageCount(currentUserId.toString());

    res.status(HttpStatusCodes.OK).json(count);
  }),
];

// PARTICIPANTS //

const participant_get_all = [
  authenticateJwt,
  asyncHandler(async (req: ReqParams<{ chatroomid: string }>, res: IRes) => {
    const { chatroomid } = req.params;

    const participants = await ParticipantService.getByChatRoomId(chatroomid);

    res.status(HttpStatusCodes.OK).json(participants);
  }),
];

const participant_post = [
  authenticateJwt,
  validate(ChatRoomSchemas.params.idParamSchema),
  validate(validationUtils.usernameOwnership('participantUsername')),
  asyncHandler(
    async (
      req: ReqParams<{ chatroomid: string }, { participantUsername: string }>,
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
  validate(ChatRoomSchemas.params.idParamSchema),
  asyncHandler(async (req: ReqParams<{ chatroomid: string }>, res: IRes) => {
    const { id, username } = req.user!;
    const { chatroomid } = req.params;

    await ParticipantService.removeParticipant({
      currentUsername: username,
      userId: id,
      chatRoomId: chatroomid,
    });

    res.status(HttpStatusCodes.OK).json({ message: 'Participant removed' });
  }),
];

const participant_page_count = [
  authenticateJwt,
  validate(ChatRoomSchemas.params.idParamSchema),
  asyncHandler(async (req: ReqParams<{ chatroomid: string }>, res: IRes) => {
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
