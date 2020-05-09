const { createLogger, format, transports } = require('winston');
const { combine, timestamp,printf } = format;
 
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
 
const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()]
});

module.exports = {
    error:(message)=>{
        logger.log('error',message)
    },
    warn:(message)=>{
        logger.log('warn',message)
    },
    info:(message)=>{
        logger.log('info',message)
    },
    debug:(message)=>{
        logger.log('debug',message)
    },
}