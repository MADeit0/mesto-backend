import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRequest } from '../types';
import UnauthorizedError from '../errors/UnauthorizedError';

const JWT_SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET! : 'dev-secret';

const auth = (req: UserRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.cookies;
  if (!authorization || !authorization?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
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
