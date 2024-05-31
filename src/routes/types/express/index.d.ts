import { TUserDocument } from '@src/models/User';
import 'express';

// **** Declaration Merging **** //

declare module 'express' {
  export interface Request {
    signedCookies: Record<string, string>;
  }
}

declare global {
  namespace Express {
    export interface User extends TUserDocument {}
  }
}
