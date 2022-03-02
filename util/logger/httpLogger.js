const morgan = require('morgan');
const logger = require('./logger');

logger.stream = {
  write: message => logger.info(message.substring(0, message.lastIndexOf('\n')))
};

module.exports = morgan(
  ':method :url from :remote-addr :status ::: :response-time ms',
  { stream: logger.stream }
)