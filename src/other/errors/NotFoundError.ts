import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '../classes';

const NOT_FOUND = 'Object not found ';

export default class NotFoundError extends RouteError {
  public constructor(message = NOT_FOUND) {
    super(HttpStatusCodes.NOT_FOUND, message);
  }
}
