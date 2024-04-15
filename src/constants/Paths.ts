/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Users: {
    BASE: '/users',
    GET_ALL: '/',
    GET: '/:userid',
    POST: '/',
    PUT: '/:userid',
    DELETE: '/:userid',
  },
  Auth: {
    BASE: '/auth',
    GET: '/data',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
  },
  ChatRoom: {
    BASE: '/chat-rooms',
    GET_ALL: '/',
    GET: '/:chatroomid',
    POST: '/',
    PUT: '/:chatroomid',
  },
  Message: {
    BASE: '/messages',
    GET_ALL: '/',
    GET: '/:messageid',
    POST: '/',
    PUT: '/:messageid',
    DELETE: '/:messageid',
  },
} as const;
