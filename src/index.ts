import './pre-start'; // Must be the first import

import EnvVars from '@src/constants/EnvVars';
import logger from 'jet-logger';
import server from './server';

// **** Run **** //

const SERVER_START_MSG =
  'Express server started on port: ' + EnvVars.PORT.toString();

server.listen(EnvVars.PORT, EnvVars.HOST, () => logger.info(SERVER_START_MSG));
