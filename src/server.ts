/**
 * Setup express server.
 */

import cors from 'cors';
import express, { NextFunction } from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import logger from 'jet-logger';
import morgan from 'morgan';
import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { Server } from 'socket.io';

import EnvVars from '@src/constants/EnvVars';
import Paths from '@src/constants/Paths';
import { NodeEnvs } from '@src/constants/misc';
import { authenticateJwt } from './middlewares/authentication';

import type { StrategyOptionsWithoutRequest } from 'passport-jwt';
import HttpStatusCodes from './constants/HttpStatusCodes';
import { RouteError } from './other/classes';
import { IRes } from './routes/types/express/misc';
import { Req } from './routes/types/types';

import socketManager from './listeners/socketManager';

import AuthRouter from '@src/routes/api/AuthAPI';
import UserRepo from './repos/UserRepo';
import ChatRoomRouter from './routes/api/ChatRoomAPI';
import messageRouter from './routes/api/MessageAPI';
import profileRouter from './routes/api/ProfileAPI';

// **** Variables **** //

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: EnvVars.CORS.ORIGIN },
});

// **** Setup **** //

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.engine.use(authenticateJwt);
io.on('connection', socketManager.onConnection);

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

const strategyOpts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: EnvVars.Jwt.SECRET,
};

passport.use(
  new JWTStrategy(strategyOpts, async (jwt_payload: { sub: string }, done) => {
    try {
      const user = await UserRepo.getOne({ id: jwt_payload.sub });

      if (user) {
        return done(null, user);
      } else {
        return done(null, null);
      }
    } catch (err) {
      return done(err, null);
    }
  }),
);

// Add APIs, must be after middleware
app.use(Paths.Base, AuthRouter);
app.use(Paths.Base, ChatRoomRouter);
app.use(Paths.Base, messageRouter);
app.use(Paths.Base, profileRouter);

// Add error handler
app.use((err: Error, req: Req, res: IRes, next: NextFunction) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  res.status(status).json({ error: err.message });
});

// **** Export default **** //

export default server;
