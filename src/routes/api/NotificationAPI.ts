import { Router } from 'express';
import notificationRoutes from '../NotificationRoutes';

const apiRouter = Router();

const notificationRouter = Router({ mergeParams: true });

notificationRouter.get('/', notificationRoutes.get_all);

notificationRouter.delete('/:notificationid', notificationRoutes.delete_one);

apiRouter.use('/notifications', notificationRouter);

export default apiRouter;
