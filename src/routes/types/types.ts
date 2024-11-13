import { User } from '@prisma/client';
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
    user?: User;
  };
}

export interface Req<T = void> extends e.Request {
  body: T;
}

export interface ReqQuery<T extends Query, U = void> extends e.Request {
  query: T;
  body: U;
}

export interface ReqParams<T extends ParamsDictionary, U = void>
  extends e.Request {
  params: T;
  body: U;
}
