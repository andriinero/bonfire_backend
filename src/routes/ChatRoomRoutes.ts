import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticate } from '@src/middlewares/authentication';
import ChatRoomService from '@src/services/ChatRoomService';
import ParticipantService from '@src/services/ParticipantService';
import validationUtils, { validate } from '@src/util/validationUtils';
import asyncHandler from 'express-async-handler';
import ChatRoomSchemas from '../schemas/ChatRoomSchemas';
import type { Req, ReqParams } from './types/types';

type ChatRoomParam = {
  chatroomid: string;
};

const chat_room_get_all = [
  authenticate,
  validate(validationUtils.queries.paginationQueriesSchema),
  asyncHandler(async (req: Req, res): Promise<void> => {
    const currentUserId = req.user!.id;
    const query = req.query;

    const allChatRooms = await ChatRoomService.getAllByUserId(
      currentUserId,
      query,
    );

    res.status(HttpStatusCodes.OK).json(allChatRooms);
  }),
];

const chat_room_get_one = [
  authenticate,
  asyncHandler(async (req: ReqParams<ChatRoomParam>, res): Promise<void> => {
    const currentUserId = req.user!.id;
    const { chatroomid } = req.params;

    const allChatRooms = await ChatRoomService.getOneById(
      currentUserId.toString(),
      chatroomid,
    );

    res.status(HttpStatusCodes.OK).json(allChatRooms);
  }),
];

const chat_room_post = [
  authenticate,
  validate(ChatRoomSchemas.hasContactsWithIds),
  asyncHandler(async (req: Req<{ userIds: string[] }>, res) => {
    const currentUserId = req.user!.id;
    const { userIds } = req.body;

    await ChatRoomService.createOne(currentUserId, userIds);

    res.status(HttpStatusCodes.OK).json({ message: 'Chat room created' });
  }),
];

const chat_room_page_count = [
  authenticate,
  asyncHandler(async (req: Req, res) => {
    const currentUserId = req.user!.id;

    const count = await ChatRoomService.getPageCountByUserId(
      currentUserId.toString(),
    );

    res.status(HttpStatusCodes.OK).json(count);
  }),
];

// PARTICIPANTS //

const participant_get_all = [
  authenticate,
  asyncHandler(async (req: ReqParams<ChatRoomParam>, res) => {
    const { chatroomid } = req.params;

    const participants = await ParticipantService.getByChatRoomId(chatroomid);

    res.status(HttpStatusCodes.OK).json(participants);
  }),
];

const participant_post = [
  authenticate,
  validate(validationUtils.notSelectingYourself('participantUsername')),
  asyncHandler(
    async (
      req: ReqParams<ChatRoomParam, { participantUsername: string }>,
      res,
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
  authenticate,
  asyncHandler(async (req: ReqParams<ChatRoomParam>, res) => {
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
  authenticate,
  asyncHandler(async (req: ReqParams<ChatRoomParam>, res) => {
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
