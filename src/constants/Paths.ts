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
    POST: '/sign-in',
  },
  ChatRoom: {
    BASE: '/chat-room',
    GET_ALL: '/',
    GET: '/:chatroomid',
    POST: '/',
    PUT: '/:chatroomid',
  },
} as const;
