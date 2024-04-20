import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Paths from '@src/constants/Paths';
import { Router } from 'express';
import ParticipantRoutes from '../ParticipantRoutes';
import { IRes } from '../types/express/misc';

const apiRouter = Router();

const participantRouter = Router({ mergeParams: true });

participantRouter.get(
  Paths.Participants.GET_ALL,
  ParticipantRoutes.participant_get_all,
);

participantRouter.post(Paths.Participants.GET_ALL, (_, res: IRes) => {
  res
    .status(HttpStatusCodes.NOT_FOUND)
    .json({ message: 'Route not implemented' });
});

participantRouter.delete(Paths.Participants.GET_ALL, (_, res: IRes) => {
  res
    .status(HttpStatusCodes.NOT_FOUND)
    .json({ message: 'Route not implemented' });
});

apiRouter.use(Paths.Participants.BASE, participantRouter);

export default apiRouter;
