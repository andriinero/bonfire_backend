import { Router } from 'express';

import Paths from '@src/constants/Paths';
import ChatRoomRoutes from '../ChatRoomRoutes';

const apiRouter = Router();

const chatRoomRouter = Router();

// CHAT ROOMS //

chatRoomRouter.get(Paths.ChatRoom.GET_ALL, ChatRoomRoutes.chat_room_get_all);

chatRoomRouter.post(Paths.ChatRoom.POST, ChatRoomRoutes.chat_room_post);

chatRoomRouter.get(Paths.ChatRoom.GET_COUNT, ChatRoomRoutes.chat_room_count);

// PARTICIPANTS //

const participantsBase = Paths.ChatRoom.Participants.BASE;

chatRoomRouter.get(
  participantsBase + Paths.ChatRoom.Participants.GET_ALL,
  ChatRoomRoutes.participant_get_all,
);

chatRoomRouter.get(
  participantsBase + Paths.ChatRoom.Participants.GET_COUNT,
  ChatRoomRoutes.participant_count,
);

apiRouter.use(Paths.ChatRoom.BASE, chatRoomRouter);

export default apiRouter;
