/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

export default {
  HOSTNAME: process.env.HOSTNAME ?? 'localhost',
  NodeEnv: process.env.NODE_ENV ?? '',
  CORS: { ORIGIN: process.env.CORS_ORIGIN },
  PORT: parseInt(process.env.PORT_BASE ?? '3000'),
  MongoDB: {
    URI: process.env.MONGODB_URI ?? '',
  },
  Jwt: {
    SECRET: process.env.JWT_SECRET ?? '',
    EXP: process.env.JWT_EXP ?? '', // exp at the same time as the cookie
  },
  Bcrypt: {
    SALT: parseInt(process.env.BCRYPT_SALT_VALUE!),
  },
  Bandwidth: {
    MAX_DOCS_PER_FETCH: 25,
  },
} as const;
