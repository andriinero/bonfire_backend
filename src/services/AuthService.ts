import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import User, { AuthPayload, TUser } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { USER_NOT_FOUND_ERR } from './UserService';

export const AUTHENTICATION_ERR = 'Incorrect credentials';

const getAuthData = (user: TUser): AuthPayload => {
  const { _id, username, email, role, profile_image } = user;

  return { sub: _id.toString(), username, email, role, profile_image };
};

const signIn = async (email: string, password: string): Promise<string> => {
  const user = await User.findOne(
    { email },
    'username email password role',
  ).exec();
  if (!user) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, AUTHENTICATION_ERR);
  }

  const jwtPayload: AuthPayload = {
    sub: user.id as string,
    username: user.username,
    email: user.email,
    role: user.role,
    profile_image: user.profile_image,
  };

  const token = jwt.sign(jwtPayload, EnvVars.Jwt.Secret, {
    expiresIn: EnvVars.Jwt.Exp,
  });

  return token;
};

export default { getAuthData, signIn };
