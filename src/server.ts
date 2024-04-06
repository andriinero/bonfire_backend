/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';

import Paths from '@src/constants/Paths';
import AuthRouter from '@src/routes/AuthAPI';
import UserRouter from '@src/routes/UserAPI';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/classes';
import mongoose from 'mongoose';
import passport from 'passport';
import {
  ExtractJwt,
  Strategy as JWTStrategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import User from './models/User';

// **** Variables **** //

const app = express();

// **** Setup **** //

const mongoDB = EnvVars.MongoDB.URI;
mongoose.set('strictQuery', false);
const main = async () => {
  await mongoose.connect(mongoDB);
};
main().catch((err: unknown) => logger.err(err, true));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));

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
  secretOrKey: EnvVars.Jwt.Secret,
};

passport.use(
  new JWTStrategy(strategyOpts, async (jwt_payload: { sub: string }, done) => {
    try {
      const user = await User.findOne({ _id: jwt_payload.sub }).exec();

      if (user) {
        const userObject = user.toObject();
        return done(null, userObject);
      } else {
        return done(null, null);
      }
    } catch (err) {
      return done(err, null);
    }
  }),
);

// Add APIs, must be after middleware

app.use(Paths.Base, UserRouter);
app.use(Paths.Base, AuthRouter);

// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  },
);

// **** Export default **** //

export default app;
