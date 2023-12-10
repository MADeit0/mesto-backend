import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRequest } from '../types';
import UnauthorizedError from '../errors/UnauthorizedError';

const auth = (req: UserRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.cookies;
  if (!authorization || !authorization?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  if (typeof payload !== 'object') {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

export default auth;
