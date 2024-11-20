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
    GET_COUNT: '/page-count',
    Participants: {
      BASE: '/:chatroomid/participants',
      GET_ALL: '/',
      GET_COUNT: '/page-count',
      POST: '/',
      DELETE: '/',
    },
  },
  Message: {
    BASE: '/chat-rooms/:chatroomid/messages',
    GET_ALL: '/',
    GET: '/:messageid',
    POST: '/',
    PUT: '/:messageid',
    DELETE: '/:messageid',
    GET_COUNT: '/page-count',
  },
  Notification: {
    BASE: '/notifications',
    GET_ALL: '/',
    DELETE: '/:notificationid',
    READ: '/:notificationid/read',
  },
  Profile: {
    BASE: '/profile',
    Contacts: {
      BASE: '/contacts',
      GET_ALL: '/',
      RECOMMENDED: '/recommended',
      POST: '/',
      DELETE: '/:userid',
      GET_COUNT: '/page-count',
    },
  },
} as const;
