import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { TUser } from '@src/models/User';
import { RouteError } from '@src/other/classes';
import UserRepo from '@src/repos/UserRepo';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const AUTHENTICATION_ERR = 'Incorrect credentials';
export const USER_NOT_FOUND_ERR = 'User not found';

type AuthPayload = {
  sub: string;
  username: string;
  email: string;
  role: string;
  profile_image: string;
};

type TSignUpBody = {
  username: string;
  email: string;
  password: string;
};

const getAuthData = (user: TUser): AuthPayload => {
  const { _id, username, email, role, profile_image } = user;

  return { sub: _id.toString(), username, email, role, profile_image };
};

const signIn = async (email: string, password: string): Promise<string> => {
  const user = await UserRepo.getOne({ email });

  if (!user) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, AUTHENTICATION_ERR);
  }

  const jwtPayload: AuthPayload = {
    sub: user._id.toString(),
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

const signUp = async (userData: TSignUpBody): Promise<void> => {
  const hashedPassword = await bcrypt.hash(
    userData.password,
    +EnvVars.Bcrypt.Salt,
  );
  const userDetails = {
    ...userData,
    password: hashedPassword,
    created: new Date(),
    role: 'user' as const,
    is_online: false,
  };

  await UserRepo.createOne(userDetails);
};

export default { getAuthData, signIn, signUp } as const;
