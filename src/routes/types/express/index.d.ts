import 'express';

import { User } from '@prisma/client';

type PrismaUser = User;

// **** Declaration Merging **** //

declare module 'express' {
  export interface Request {
    signedCookies: Record<string, string>;
  }
}

declare global {
  namespace Express {
    export interface User extends PrismaUser {}
  }
}
