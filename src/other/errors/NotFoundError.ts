import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '../classes';

const NOT_FOUND = 'Object not found ';

export default class NotFoundError extends RouteError {
  public constructor() {
    super(HttpStatusCodes.NOT_FOUND, NOT_FOUND);
  }
}
