import { Router } from 'express';
import LanguagesRoutes from '../LanguagesRoutes';

const apiRouter = Router();

const languageRouter = Router({ mergeParams: true });

languageRouter.get('/', LanguagesRoutes.get_all);

languageRouter.get('/:languageid', LanguagesRoutes.get_one);

apiRouter.use('/languages', languageRouter);

export default apiRouter;
