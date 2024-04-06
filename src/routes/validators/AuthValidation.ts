import { body } from 'express-validator';

const signInData = [
  body('username').trim().escape(),
  body('password').trim().escape(),
];

export default { signInData };
