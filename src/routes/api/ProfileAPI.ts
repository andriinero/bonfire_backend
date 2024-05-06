import Paths from '@src/constants/Paths';
import { Router } from 'express';
import ProfileRoutes from '../ProfileRoutes';

const apiRouter = Router();

const profileRouter = Router({ mergeParams: true });

// CONTACTS //

const contactsBase = Paths.Profile.Contacts.BASE;

profileRouter.get(
  contactsBase + Paths.Profile.Contacts.GET_ALL,
  ProfileRoutes.contacts_get_all,
);

profileRouter.delete(
  contactsBase + Paths.Profile.Contacts.DELETE,
  ProfileRoutes.contacts_delete,
);

apiRouter.use(Paths.Profile.BASE, profileRouter);

export default apiRouter;
