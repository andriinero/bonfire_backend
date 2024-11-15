import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '../classes';

const CONTACT_EXISTS_ERROR = 'Contact with this id already exists';

export default class ContactExistsError extends RouteError {
  public constructor(message = CONTACT_EXISTS_ERROR) {
    super(HttpStatusCodes.BAD_REQUEST, message);
  }
}
