import { Router } from 'express';
import ProfileRoutes from '../ProfileRoutes';

const apiRouter = Router();

const profileRouter = Router({ mergeParams: true });

// CONTACTS //

const contactsBase = '/contacts';

profileRouter.get(contactsBase + '/', ProfileRoutes.contacts_get_all);

profileRouter.get(
  contactsBase + '/recommended',
  ProfileRoutes.contacts_get_recommended,
);

profileRouter.post(contactsBase + '/', ProfileRoutes.contact_post);

profileRouter.delete(contactsBase + '/:userid', ProfileRoutes.contacts_delete);

profileRouter.get(
  contactsBase + '/page-count',
  ProfileRoutes.contacts_page_count,
);

apiRouter.use('/profile', profileRouter);

export default apiRouter;
