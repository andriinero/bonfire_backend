import { param as reqParam, query as reqQuery } from 'express-validator';
import { isValidObjectId } from 'mongoose';

const validateUserIdParam = reqParam('userid', 'User id must be valid')
  .trim()
  .custom(isValidObjectId)
  .escape();

const defaultQueriesValidators = [
  reqQuery('limit').default(25).trim().escape(),
  reqQuery('page').default(0).trim().escape(),
];

const params = { validateUserIdParam };

const queries = { defaultQueriesValidators };

export default {
  params,
  queries,
} as const;
