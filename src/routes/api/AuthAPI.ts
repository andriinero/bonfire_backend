import Paths from '@src/constants/Paths';
import { Router } from 'express';
import authRoutes from '../AuthRoutes';

const apiRouter = Router();

const authRouter = Router();

authRouter.get(Paths.Auth.GET, authRoutes.get);

authRouter.post(Paths.Auth.SIGN_IN, authRoutes.sign_in_post);

authRouter.post(Paths.Auth.SIGN_UP, authRoutes.sign_up_post);

apiRouter.use(Paths.Auth.BASE, authRouter);

export default apiRouter;
