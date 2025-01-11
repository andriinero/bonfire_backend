import { Router } from 'express';
import LanguageRoutes from '../LanguageRoutes';

const apiRouter = Router();

const languageRouter = Router({ mergeParams: true });

languageRouter.get('/', LanguageRoutes.get_all);

languageRouter.get('/:languageid', LanguageRoutes.get_one);

apiRouter.use('/languages', languageRouter);

export default apiRouter;
