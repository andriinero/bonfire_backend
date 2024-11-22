import { Router } from 'express';
import ChatRoomRoutes from '../ChatRoomRoutes';

const apiRouter = Router();

const chatRoomRouter = Router();

chatRoomRouter.get('/', ChatRoomRoutes.chat_room_get_all);

chatRoomRouter.post('/', ChatRoomRoutes.chat_room_post);

chatRoomRouter.get('/page-count', ChatRoomRoutes.chat_room_page_count);

// PARTICIPANTS //

const participantsBase = '/:chatroomid/participants';

chatRoomRouter.get(participantsBase + '/', ChatRoomRoutes.participant_get_all);

chatRoomRouter.get(
  participantsBase + '/page-count',
  ChatRoomRoutes.participant_page_count,
);

chatRoomRouter.post(participantsBase + '/', ChatRoomRoutes.participant_post);

chatRoomRouter.delete(
  participantsBase + '/',
  ChatRoomRoutes.participant_delete,
);

apiRouter.use('/chat-rooms', chatRoomRouter);

export default apiRouter;
