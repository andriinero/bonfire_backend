import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { RouteError } from '../classes';

const PARTICIPANT_EXISTS = 'Participant already exists';

export default class ParticipantExistsError extends RouteError {
  public constructor() {
    super(HttpStatusCodes.BAD_REQUEST, PARTICIPANT_EXISTS);
  }
}
