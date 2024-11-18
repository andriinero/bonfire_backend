import Paths from '@src/constants/Paths';
import { Router } from 'express';
import notificationRoutes from '../NotificationRoutes';

const apiRouter = Router();

const notificationRouter = Router({ mergeParams: true });

notificationRouter.get(
  Paths.Notification.GET_ALL,
  notificationRoutes.notification_get_all,
);

notificationRouter.delete(
  Paths.Notification.DELETE,
  notificationRoutes.notification_delete,
);

apiRouter.use(Paths.Notification.BASE, notificationRouter);

export default apiRouter;
