/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import passport from 'passport';

export const authenticate = passport.authenticate('jwt', { session: false });

