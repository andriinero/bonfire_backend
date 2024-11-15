import EnvVars from '@src/constants/EnvVars';
import type { ColorClass } from '@src/constants/misc';
import NotFoundError from '@src/other/errors/NotFoundError';
import UnauthorizedError from '@src/other/errors/UnauthorizedError';
import UserRepo from '@src/repos/UserRepo';
import { getRandomColorClass } from '@src/util/getRandomColorClass';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

type AuthData = {
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

const getAuthData = async (userId: string) => {
  const user = await UserRepo.getOne({ id: userId });
  if (!user) throw new NotFoundError();

  const { id, username, email, role, profileImage, colorClass } = user;
  const authData: AuthData = {
    sub: id,
    username,
    email,
    role,
    profile_image: profileImage,
    color_class: colorClass,
  };

  return authData;
};

const signIn = async (email: string, password: string) => {
  const user = await UserRepo.getOne({ email }, false);
  if (!user) throw new NotFoundError();

  const match = bcrypt.compareSync(password, user.password);
  if (!match) throw new UnauthorizedError();

  const jwtPayload: AuthData = {
    sub: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    profile_image: user.profileImage,
    color_class: user.colorClass as ColorClass,
  };
  const token = jwt.sign(jwtPayload, EnvVars.Jwt.SECRET, {
    expiresIn: EnvVars.Jwt.EXP,
  });

  return token;
};

const signUp = async (data: SignUpData) => {
  const hashedPassword = await bcrypt.hash(data.password, +EnvVars.Bcrypt.SALT);
  const userData = {
    ...data,
    password: hashedPassword,
    created: new Date(),
    role: 'USER' as const,
    isOnline: false,
    colorClass: getRandomColorClass(),
  };

  await UserRepo.createOne(userData);
};

export default { getAuthData, signIn, signUp } as const;
