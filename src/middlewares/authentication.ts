/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import passport from 'passport';

export const authenticateJwt = passport.authenticate('jwt', { session: false });
