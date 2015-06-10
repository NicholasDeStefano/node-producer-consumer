'use strict';

var winston = require('winston');
var fs = require('fs');

var logDir = './logs';

winston.emitErrs = true;

if (!fs.existsSync(logDir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(logDir);
}

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: logDir + '/all-logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'error',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
};
