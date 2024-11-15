import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '../classes';

const AUTHENTICATION_ERR = 'Incorrect credentials';

export default class UnauthorizedError extends RouteError {
  public constructor(message = AUTHENTICATION_ERR) {
    super(HttpStatusCodes.UNAUTHORIZED, message);
  }
}
