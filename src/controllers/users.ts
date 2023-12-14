import { NextFunction, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { UserRequest } from '../types';

import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import ConflictError from '../errors/Conflict';
import 'dotenv/config';

export const findUsers = (req: UserRequest, res: Response, next: NextFunction) => User.find({})
  .then((user) => res.send({ data: user }))
  .catch((err) => next(err));

export const findUserById = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => User.findById(req.params.userId)
  .orFail(new NotFoundError('Пользователь с указанным _id не существует'))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    switch (true) {
      case err.name === 'CastError':
        next(new BadRequestError('Передан невалидный _id'));
        break;
      default:
        next(err);
    }
  });

export const createUser = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => bcrypt.hash(req.body.password, 10)
  .then((hash) => User.create({
    ...req.body, password: hash,
  }))
  .then((user) => {
    const { password, ...userWithoutPassword } = user.toObject();
    res.send(userWithoutPassword);
  })
  .catch((err) => {
    switch (true) {
      case err.code === 11000:
        next(new ConflictError('Пользовательль с таким email уже существует'));
        break;
      case err.name === 'ValidationError':
        next(new BadRequestError('Данные пользователя введены некорректно'));
        break;
      default:
        next(err);
    }
  });

export const updateUserData = (req: UserRequest, res: Response, next: NextFunction) => {
  const userData = {
    name: req.body.name,
    about: req.body.about,
  };

  return User.findByIdAndUpdate(req.user?._id, userData, { new: true, runValidators: true })
    .select('+email')
    .orFail(new NotFoundError('Пользователь с указанным _id не существует'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (true) {
        case err.name === 'ValidationError':
          next(new BadRequestError('Данные пользователя введены некорректно'));
          break;
        default:
          next(err);
      }
    });
};

export const updateUserAvatar = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => User.findByIdAndUpdate(
  req.user?._id,
  { avatar: req.body.avatar },
  { new: true, runValidators: true },
)
  .orFail(new NotFoundError('Пользователь с указанным _id не существует'))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    switch (true) {
      case err.name === 'ValidationError':
        next(new BadRequestError('Некорректная ссылка на аватар'));
        break;
      case err.name === 'CastError':
        next(new BadRequestError('Передан невалидный _id'));
        break;
      default:
        next(err);
    }
  });

export const getMyProfile = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => User.findById(req.user?._id)
  .select('+email')
  .orFail(new NotFoundError('Пользователь с указанным _id не существует'))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    switch (true) {
      case err.name === 'CastError':
        next(new BadRequestError('Передан невалидный _id'));
        break;
      default:
        next(err);
    }
  });

export const login = (req: UserRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const JWT_SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET! : 'dev-secret';

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      const bearToken = `Bearer ${token}`;
      res.cookie('authorization', bearToken, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .end();
    })
    .catch((err) => next(err));
};
