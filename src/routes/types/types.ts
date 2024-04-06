import * as e from 'express';
import { Query, ParamsDictionary } from 'express-serve-static-core';

// **** Express **** //

export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IReqQuery<T extends Query, U = void> extends e.Request {
  query: T;
  body: U;
}

export interface IReqParams<T extends ParamsDictionary, U = void>
  extends e.Request {
  params: T;
  body: U;
}
