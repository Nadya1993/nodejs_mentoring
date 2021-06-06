import winston, { format } from 'winston';
import express from 'express';
import { UserServiceInstance } from '../services/UserService';
import { severityLevel } from '../types';
import { getVariableName } from './getVariableName';
import { GroupServiceInstance } from '../services/GroupService';

const BaseLogger = winston.createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: severityLevel.error }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  BaseLogger.add(new winston.transports.Console({
    format: format.combine(
      format.colorize(),
      format.splat()
    )
  }));
}

export const userLogger = BaseLogger.child({
  defaultMeta: {
    service: UserServiceInstance.constructor.name
  }
});

export const groupLogger = BaseLogger.child({
  defaultMeta: {
    service: GroupServiceInstance.constructor.name
  }
});

export const logInfo = (logger: winston.Logger) =>
  (req: express.Request, res: express.Response) => {
    const { params } = res.locals;
    logger.info({
      method: res.locals.method,
      params: params && getVariableName(params)
    })
  }

export const logError = (logger: winston.Logger) =>
  (error: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { params } = res.locals;
    logger.error({
      method: res.locals.method,
      params: params && getVariableName(params),
      error
    })
    res.status(500).send(error)
  }

process.on('uncaughtException', (exception: express.ErrorRequestHandler, origin: string) => {
  BaseLogger.error({
    type: 'uncaughtException',
    exception,
    origin
  })
});

process.on('unhandledRejection', exception => {
  BaseLogger.error({
    type: 'unhandledRejection',
    exception
  })
});
