import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticate } from '@src/middlewares/authentication';
import LanguagesService from '@src/services/LanguageService';
import validationUtils, { validate } from '@src/util/validationUtils';
import asyncHandler from 'express-async-handler';
import { ReqParams, ReqQuery } from './types/types';

const get_all = [
  authenticate,
  validate(validationUtils.queries.paginationQueriesSchema),
  asyncHandler(async (req: ReqQuery<{ limit: string; page: string }>, res) => {
    const { limit, page } = req.query;
    const queryOpts = {
      limit: +limit,
      page: +page,
    };

    const languages = await LanguagesService.getAll(queryOpts);

    res.status(HttpStatusCodes.OK).json(languages);
  }),
];

const get_one = [
  authenticate,
  asyncHandler(async (req: ReqParams<{ languageid: string }>, res) => {
    const { languageid } = req.params;

    const language = await LanguagesService.getOneById(languageid);

    res.status(HttpStatusCodes.OK).json(language);
  }),
];

export default {
  get_all,
  get_one,
} as const;
