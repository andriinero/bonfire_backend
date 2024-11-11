import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import EnvVars from '@src/constants/EnvVars';
import { RouteError } from '@src/other/classes';
import { getRandomColorClass } from '@src/util/getRandomColorClass';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import type { ColorClass } from '@src/constants/misc';

import UserRepo from '@src/repos/UserRepo';

export const AUTHENTICATION_ERR = 'Incorrect credentials';
export const USER_NOT_FOUND_ERR = 'User not found';

type AuthPayload = {
  sub: string;
  username: string;
  email: string;
  role: string;
  profile_image: string | null;
  color_class: string;
};

type SignUpData = {
  username: string;
  email: string;
  password: string;
};

const getAuthData = async (userId: string): Promise<AuthPayload> => {
  const user = await UserRepo.getOne({ id: userId });
  // FIXME: remove comment
  console.log(user);

  if (!user)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  const { id, username, email, role, profile_image, color_class } = user;

  return {
    sub: id,
    username,
    email,
    role,
    profile_image,
    color_class,
  };
};

const signIn = async (email: string, password: string) => {
  const user = await UserRepo.getOne({ email }, false);
  if (!user)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  const match = bcrypt.compareSync(password, user.password);
  if (!match)
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, AUTHENTICATION_ERR);

  const jwtPayload: AuthPayload = {
    sub: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    profile_image: user.profile_image,
    color_class: user.color_class as ColorClass,
  };

  const token = jwt.sign(jwtPayload, EnvVars.Jwt.SECRET, {
    expiresIn: EnvVars.Jwt.EXP,
  });

  return token;
};

const signUp = async (signUpData: SignUpData) => {
  const hashedPassword = await bcrypt.hash(
    signUpData.password,
    +EnvVars.Bcrypt.SALT,
  );
  const userDetails = {
    ...signUpData,
    password: hashedPassword,
    created: new Date(),
    role: 'user' as const,
    is_online: false,
    color_class: getRandomColorClass(),
  };

  await UserRepo.createOne(userDetails);
};

export default { getAuthData, signIn, signUp } as const;
