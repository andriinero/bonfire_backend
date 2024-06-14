import { param as reqParam, query as reqQuery } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { NextFunction } from 'express';
import type { AnyZodObject, ZodEffects } from 'zod';
import type { IRes } from '../types/express/misc';
import type { IReq } from '../types/types';

export const validate =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: IReq, res: IRes, next: NextFunction) => {
    try {
      await schema.parseAsync(req);
      next();
    } catch (error) {
      let err = error as unknown;
      if (err instanceof z.ZodError) {
        err = err.issues.map((e) => ({ path: e.path[0], message: e.message }));
      }

      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: 'Validation error',
        errors: err,
      });
    }
  };

const usernameOwnership = (fieldName: string) =>
  z
    .object({
      user: z.object({ username: z.string() }),
      body: z.object({
        [fieldName]: z.string().trim(),
      }),
    })
    .refine(({ body, user: { username } }) => username !== body[fieldName], {
      message: "You can't select yourself",
    });

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
  validate,
  usernameOwnership,
} as const;
