/* eslint-disable node/no-process-env */

export default {
  HOSTNAME: process.env.HOSTNAME ?? 'localhost',
  NodeEnv: process.env.NODE_ENV ?? 'DEVELOPMENT',
  CORS: { ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5174' },
  PORT: parseInt(process.env.PORT ?? '3000'),
  MongoDB: {
    URI: process.env.MONGODB_URI ?? '',
  },
  Jwt: {
    SECRET: process.env.JWT_SECRET ?? '',
    EXP: process.env.JWT_EXP ?? '',
  },
  Bcrypt: {
    SALT: parseInt(process.env.BCRYPT_SALT_VALUE!),
  },
  Bandwidth: {
    MAX_DOCS_PER_FETCH: 25,
  },
} as const;
