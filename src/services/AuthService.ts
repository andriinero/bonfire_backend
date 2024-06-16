import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import EnvVars from '@src/constants/EnvVars';
import { RouteError } from '@src/other/classes';
import { getRandomColorClass } from '@src/util/getRandomColorClass';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { ColorClass } from '@src/constants/misc';
import type { TUser } from '@src/models/User';

import UserRepo from '@src/repos/UserRepo';

export const AUTHENTICATION_ERR = 'Incorrect credentials';
export const USER_NOT_FOUND_ERR = 'User not found';

type AuthPayload = {
  sub: string;
  username: string;
  email: string;
  role: string;
  profile_image: string;
  color_class: ColorClass;
};

type TSignUpBody = {
  username: string;
  email: string;
  password: string;
};

const getAuthData = (user: TUser): AuthPayload => {
  const { _id, username, email, role, profile_image, color_class } = user;

  return {
    sub: _id.toString(),
    username,
    email,
    role,
    profile_image,
    color_class,
  };
};

const signIn = async (email: string, password: string) => {
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
    color_class: user.color_class,
  };

  const token = jwt.sign(jwtPayload, EnvVars.Jwt.SECRET, {
    expiresIn: EnvVars.Jwt.EXP,
  });

  return token;
};

const signUp = async (userData: TSignUpBody) => {
  const hashedPassword = await bcrypt.hash(
    userData.password,
    +EnvVars.Bcrypt.SALT,
  );
  const userDetails = {
    ...userData,
    password: hashedPassword,
    created: new Date(),
    role: 'user' as const,
    is_online: false,
    color_class: getRandomColorClass(),
  };

  await UserRepo.createOne(userDetails);
};

export default { getAuthData, signIn, signUp } as const;
