import { param, query } from 'express-validator';
import { isValidObjectId } from 'mongoose';

const useridParam = param('userid', 'User id must be valid')
  .trim()
  .custom(isValidObjectId)
  .escape();

const defaultQueries = [
  query('limit').default(50).trim().isNumeric().escape(),
  query('page').default(0).trim().isNumeric().escape(),
];

export default {
  useridParam,
  defaultQueries,
} as const;
