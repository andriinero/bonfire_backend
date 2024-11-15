import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '../classes';

const PARTICIPANT_EXISTS = 'Participant already exists';

export default class ParticipantExistsError extends RouteError {
  public constructor(message = PARTICIPANT_EXISTS) {
    super(HttpStatusCodes.BAD_REQUEST, message);
  }
}
