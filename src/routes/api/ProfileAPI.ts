import { Router } from 'express';
import NotificationRoutes from '../NotificationRoutes';
import ProfileRoutes from '../ProfileRoutes';

const apiRouter = Router();

const contactRouter = Router({ mergeParams: true });
const notificationRouter = Router({ mergeParams: true });
const profileRouter = Router({ mergeParams: true });

// CONTACT //

contactRouter.get('/', ProfileRoutes.contacts_get_all);

contactRouter.get('/recommended', ProfileRoutes.contacts_get_recommended);

contactRouter.post('/', ProfileRoutes.contact_post);

contactRouter.delete('/:userid', ProfileRoutes.contacts_delete);

contactRouter.get('/page-count', ProfileRoutes.contacts_page_count);

// NOTIFICATIONS //

notificationRouter.get('/', NotificationRoutes.get_all);

notificationRouter.delete('/', NotificationRoutes.delete_all);

notificationRouter.delete('/:notificationid', NotificationRoutes.delete_one);

profileRouter.use('/contacts', contactRouter);
profileRouter.use('/notifications', notificationRouter);

apiRouter.use('/profile', profileRouter);

export default apiRouter;
