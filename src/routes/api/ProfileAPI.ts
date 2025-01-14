import { Router } from 'express';
import ContactRoutes from '../profileRoutes/ContactRoutes';
import NotificationRoutes from '../profileRoutes/NotificationRoutes';
import ProfileRoutes from '../profileRoutes/ProfileRoutes';

const apiRouter = Router();

const contactRouter = Router({ mergeParams: true });
const notificationRouter = Router({ mergeParams: true });
const profileRouter = Router({ mergeParams: true });

// PROFILE //

profileRouter.patch('/', ProfileRoutes.patch);

// CONTACT //

contactRouter.get('/', ContactRoutes.contacts_get_all);

contactRouter.get('/recommended', ContactRoutes.contacts_get_recommended);

contactRouter.post('/', ContactRoutes.contact_post);

contactRouter.delete('/:userid', ContactRoutes.contacts_delete);

contactRouter.get('/page-count', ContactRoutes.contacts_page_count);

// NOTIFICATIONS //

notificationRouter.get('/', NotificationRoutes.get_all);

notificationRouter.delete('/', NotificationRoutes.delete_all);

notificationRouter.post(
  '/:notificationid/mark-as-read',
  NotificationRoutes.post_mark_as_read,
);

notificationRouter.delete('/:notificationid', NotificationRoutes.delete_one);

profileRouter.use('/contacts', contactRouter);
profileRouter.use('/notifications', notificationRouter);

apiRouter.use('/profile', profileRouter);

export default apiRouter;
