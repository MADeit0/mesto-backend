import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SessionRequest } from '../types';

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.cookies;
  if (!authorization || !authorization?.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  if (typeof payload !== 'object') {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
};
