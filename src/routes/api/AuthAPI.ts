import { Router } from 'express';
import authRoutes from '../AuthRoutes';

const apiRouter = Router();

const authRouter = Router({ mergeParams: true });

authRouter.get('/data', authRoutes.get_data);

authRouter.post('/sign-in', authRoutes.sign_in_post);

authRouter.post('/sign-up', authRoutes.sign_up_post);

apiRouter.use('/auth', authRouter);

export default apiRouter;
