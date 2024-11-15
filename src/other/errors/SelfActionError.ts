import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '../classes';

const SELF_ACTION_ERROR = "Target object can't be the current user";

export default class SelfActionError extends RouteError {
  public constructor(message = SELF_ACTION_ERROR) {
    super(HttpStatusCodes.BAD_REQUEST, message);
  }
}
