import 'express';

import type { TUserSchemaDocument } from '@src/models/User';

// **** Declaration Merging **** //

declare module 'express' {
  export interface Request {
    signedCookies: Record<string, string>;
  }
}

declare global {
  namespace Express {
    export interface User extends TUserSchemaDocument {}
  }
}
