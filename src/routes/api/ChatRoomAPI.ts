import { Router } from 'express';

import Paths from '@src/constants/Paths';
import ChatRoomRoutes from '../ChatRoomRoutes';

const apiRouter = Router();

const chatRoomRouter = Router();

chatRoomRouter.get(Paths.ChatRoom.GET_ALL, ChatRoomRoutes.getAll);

chatRoomRouter.get(Paths.ChatRoom.GET, ChatRoomRoutes.getOne);

chatRoomRouter.post(Paths.ChatRoom.POST, ChatRoomRoutes.post);

chatRoomRouter.put(Paths.ChatRoom.PUT, ChatRoomRoutes.put);

apiRouter.use(Paths.ChatRoom.BASE, chatRoomRouter);

export default apiRouter;
