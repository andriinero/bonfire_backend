import { User } from '@prisma/client';
import type { Response } from 'supertest';

// Misc
export type ReqBody = Record<string, unknown>;
export type Res = Omit<Response, 'body'> & { body: Body };
export type ApiCb = (res: Res) => void;

// Response Body: Add things to the body here over time to prevent
// typescript errors.
type Body = {
  [key: string]: unknown;
  user?: User;
  users?: User[];
};
