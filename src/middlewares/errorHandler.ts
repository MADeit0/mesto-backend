import { Request, Response, NextFunction } from 'express';
import statusCodes from '../constants/statusCodes';

const errorHandler = (
  err: { statusCode: number; message: string; },
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
) => {
  const { statusCode = statusCodes.INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === statusCodes.INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
};

export default errorHandler;
