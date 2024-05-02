import Paths from '@src/constants/Paths';
import { Router } from 'express';
import ProfileRoutes from '../ProfileRoutes';

const apiRouter = Router();

const profileRouter = Router({ mergeParams: true });

profileRouter.get(Paths.Profile.GET_CONTACTS, ProfileRoutes.contacts_get_all);

apiRouter.use(Paths.Profile.BASE, profileRouter);

export default apiRouter;
