import { Router } from 'express';

import Paths from '@src/constants/Paths';
import AuthRoutes from './AuthRoutes';

const apiRouter = Router();

const authRouter = Router();

authRouter.get(Paths.Auth.GET, AuthRoutes.get);

authRouter.post(Paths.Auth.POST, AuthRoutes.post);

// Add AuthRouter
apiRouter.use(Paths.Auth.BASE, authRouter);

export default apiRouter;
