import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
  filename: 'requests-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d',
});

const errorsTransport = new winston.transports.DailyRotateFile({
  filename: 'errors-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d',
});

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    transport,
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    errorsTransport,
  ],
  format: winston.format.json(),
});

export { requestLogger, errorLogger };
