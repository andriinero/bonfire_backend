import { TUser } from '@src/models/User';
import * as e from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { IncomingMessage } from 'http';
import { Document } from 'mongoose';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

// **** Express **** //
//
export interface ISocket
  extends Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    unknown
  > {
  request: IncomingMessage & {
    user?: Document<unknown, unknown, TUser> & TUser;
  };
}

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
