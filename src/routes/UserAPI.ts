import { Router } from 'express';

import Paths from '../constants/Paths';
import UserRoutes from './UserRoutes';

const apiRouter = Router();

const userRouter = Router();

userRouter.get(Paths.Users.GET_ALL, UserRoutes.getAll);

userRouter.get(Paths.Users.GET, UserRoutes.getOne);

userRouter.post(Paths.Users.POST, UserRoutes.post);

userRouter.put(Paths.Users.PUT, UserRoutes.put);

// Add UserRouter
apiRouter.use(Paths.Users.BASE, userRouter);

export default apiRouter;
