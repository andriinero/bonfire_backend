import Paths from '@src/constants/Paths';
import { Router } from 'express';
import ChatRoomRoutes from '../ChatRoomRoutes';

const apiRouter = Router();

const chatRoomRouter = Router();

// CHAT ROOMS //

chatRoomRouter.get(Paths.ChatRoom.GET_ALL, ChatRoomRoutes.chat_room_get_all);

chatRoomRouter.post(Paths.ChatRoom.POST, ChatRoomRoutes.chat_room_post);

chatRoomRouter.get(
  Paths.ChatRoom.GET_COUNT,
  ChatRoomRoutes.chat_room_page_count,
);

// PARTICIPANTS //

const participantsBase = Paths.ChatRoom.Participants.BASE;

chatRoomRouter.get(
  participantsBase + Paths.ChatRoom.Participants.GET_ALL,
  ChatRoomRoutes.participant_get_all,
);

chatRoomRouter.get(
  participantsBase + Paths.ChatRoom.Participants.GET_COUNT,
  ChatRoomRoutes.participant_page_count,
);

chatRoomRouter.post(
  participantsBase + Paths.ChatRoom.Participants.GET_COUNT,
  () => {},
);

chatRoomRouter.delete(
  participantsBase + Paths.ChatRoom.Participants.GET_COUNT,
  () => {},
);

apiRouter.use(Paths.ChatRoom.BASE, chatRoomRouter);

export default apiRouter;
