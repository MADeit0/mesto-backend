import { NextFunction, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { UserRequest } from '../types';

import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import ConflictError from '../errors/Conflict';

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

export const createUser = (req: UserRequest, res: Response, next: NextFunction) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      ...req.body, password: hash,
    })
      .then((user) => res.send({ data: user }))
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
      }));
};

export const updateUserData = (req: UserRequest, res: Response, next: NextFunction) => {
  const userData = {
    name: req.body.name,
    about: req.body.about,
    email: req.body.email,
  };
  const notEmptyUserData = Object.fromEntries(Object.entries(userData)
    .filter(([, value]) => value));

  return User.findByIdAndUpdate(req.user?._id, notEmptyUserData, { new: true, runValidators: true })
    .select('+email')
    .orFail(new NotFoundError('Пользователь с указанным _id не существует'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (true) {
        case err.name === 'ValidationError':
          next(new BadRequestError('Данные пользователя введены некорректно'));
          break;
        case err.name === 'CastError':
          next(new BadRequestError('Передан невалидный _id'));
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
        next(new BadRequestError('Данные для смены аватара введены некорректно'));
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

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      const bearToken = `Bearer ${token}`;
      res.cookie('authorization', bearToken, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .end();
    })
    .catch((err) => next(err));
};
