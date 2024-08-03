import type { TUserSchemaDocument } from '@src/models/User';
import type * as e from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import type { IncomingMessage } from 'http';
import type { Socket } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

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
    user?: TUserSchemaDocument;
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
