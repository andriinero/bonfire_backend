import { Router } from 'express';

import Paths from '@src/constants/Paths';
import ChatRoomRoutes from '../ChatRoomRoutes';

const apiRouter = Router();

const chatRoomRouter = Router();

chatRoomRouter.get(Paths.ChatRoom.GET_ALL, ChatRoomRoutes.chat_room_get_all);

chatRoomRouter.get(Paths.ChatRoom.GET, ChatRoomRoutes.chat_room_get_one);

chatRoomRouter.post(Paths.ChatRoom.POST, ChatRoomRoutes.chat_room_post);

chatRoomRouter.put(Paths.ChatRoom.PUT, ChatRoomRoutes.chat_room_put);

// TODO: split into two APIs?
chatRoomRouter.get(
  Paths.ChatRoom.Participants.BASE + Paths.ChatRoom.Participants.GET_ALL,
  ChatRoomRoutes.participant_get_all,
);

apiRouter.use(Paths.ChatRoom.BASE, chatRoomRouter);

export default apiRouter;
