import { z } from 'zod';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IRes } from '@src/routes/types/express/misc';
import { IReq } from '@src/routes/types/types';
import type { NextFunction } from 'express';
import type { AnyZodObject, ZodEffects } from 'zod';

export const validate =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: IReq, res: IRes, next: NextFunction) => {
    try {
      const validationResult = await schema.parseAsync(req);
      for (const [key, value] of Object.entries(validationResult)) {
        //@ts-expect-error incorrect type inferring
        req[key] = value;
      }
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

const userIdParamSchema = z.object({
  params: z.object({
    userid: z.string().trim(),
  }),
});

const defaultQueriesSchema = z.object({
  query: z.object({
    limit: z.number().default(25),
    page: z.number().default(0),
  }),
});

const params = { userIdParamSchema };

const queries = { defaultQueriesSchema };

export default {
  params,
  queries,
  validate,
  usernameOwnership,
} as const;
