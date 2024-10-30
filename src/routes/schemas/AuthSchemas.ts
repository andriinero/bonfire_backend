import { z } from 'zod';

import UserRepo from '@src/repos/UserRepo';

const signInDataSchema = z.object({
  body: z.object({ email: z.string().trim(), password: z.string().trim() }),
});

const signUpDataSchema = z
  .object({
    body: z.object({
      username: z
        .string({ message: 'Username must be valid' })
        .trim()
        .refine(
          async (value) => {
            const usernamePersists = await UserRepo.persistOne({
              username: value,
            });

            return !usernamePersists;
          },
          { message: 'User with this username already exists' },
        ),
      email: z
        .string({ message: 'Email must be valid' })
        .trim()
        .email()
        .refine(
          async (value) => {
            const emailPersists = await UserRepo.persistOne({
              email: value,
            });

            return !emailPersists;
          },
          { message: 'User with this email already exists' },
        ),
      password: z.string().trim(),
      confirmPassword: z.string().trim(),
    }),
  })
  .refine(
    ({ body: { password, confirmPassword } }) => password === confirmPassword,
    { message: "Passwords don't match" },
  );

const body = {
  signInDataSchema,
  signUpDataSchema,
};

export default { body } as const;
