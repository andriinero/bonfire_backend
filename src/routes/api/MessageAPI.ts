import { Router } from 'express';
import MessageRoutes from '../MessageRoutes';

const apiRouter = Router();

const messageRouter = Router({ mergeParams: true });

messageRouter.get('/', MessageRoutes.get_all);

messageRouter.post('/', MessageRoutes.post);

messageRouter.get('/page-count', MessageRoutes.page_count);

apiRouter.use('/chat-rooms/:chatroomid/messages', messageRouter);

export default apiRouter;
