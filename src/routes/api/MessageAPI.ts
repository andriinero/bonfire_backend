import Paths from '@src/constants/Paths';
import { Router } from 'express';
import MessageRoutes from '../MessageRoutes';

const apiRouter = Router();

const messageRouter = Router();

messageRouter.get(Paths.Message.GET_ALL, MessageRoutes.message_get_all);

apiRouter.use(Paths.Message.BASE, messageRouter);

export default apiRouter;
