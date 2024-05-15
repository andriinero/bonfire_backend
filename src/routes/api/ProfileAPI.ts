import Paths from '@src/constants/Paths';
import { Router } from 'express';
import ProfileRoutes from '../ProfileRoutes';

const apiRouter = Router();

const profileRouter = Router({ mergeParams: true });

// ONLINE STATUS //

profileRouter.put(Paths.Profile.ONLINE_STATUS, ProfileRoutes.online_status_put);

// CONTACTS //

const contactsBase = Paths.Profile.Contacts.BASE;

profileRouter.get(
  contactsBase + Paths.Profile.Contacts.GET_ALL,
  ProfileRoutes.contacts_get_all,
);

profileRouter.post(
  contactsBase + Paths.Profile.Contacts.POST,
  ProfileRoutes.contact_post,
);

profileRouter.delete(
  contactsBase + Paths.Profile.Contacts.DELETE,
  ProfileRoutes.contacts_delete,
);

profileRouter.get(
  contactsBase + Paths.Profile.Contacts.GET_COUNT,
  ProfileRoutes.contacts_count,
);

apiRouter.use(Paths.Profile.BASE, profileRouter);

export default apiRouter;
