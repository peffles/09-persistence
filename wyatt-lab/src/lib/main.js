'use strict';

const server = require('./server');
const logger = require('./logger');

const PORT = process.env.PORT || 3000;

server.start(PORT, () => logger.log(logger.INFO, `MAIN: listening on ${PORT}`));
