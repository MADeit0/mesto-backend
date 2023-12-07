import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import statusCodes from '../constants/statusCodes';
import User, { IUser } from '../models/user';
import { SessionRequest } from '../types';

type userRequest = Request<{}, {}, IUser, {}>

export const findUsers = (req: Request, res: Response) => User.find({})
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));

export const findUserById = (req: Request, res: Response) => User.findById(req.params.userId)
  .orFail(new Error('NotFound'))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    switch (true) {
      case err.name === 'CastError':
        res.status(statusCodes.BAD_REQUEST).send({ message: 'Передан невалидный _id' });
        break;
      case err.message === 'NotFound':
        res.status(statusCodes.NOT_FOUND).send({ message: 'Пользователь с указанным _id не существует' });
        break;
      default:
        res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

export const createUser = (req: userRequest, res: Response) => {
  bcrypt.hash(req.body.password, 10).then((hash) => User.create({
    ...req.body, password: hash,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (true) {
        case err.code === 11000:
          res.status(statusCodes.BAD_REQUEST).send({ message: 'Пользовательль с таким email уже существует' });
          break;
        case err.name === 'ValidationError':
          res.status(statusCodes.BAD_REQUEST).send({ message: 'Данные пользователя введены некорректно' });
          break;
        default:
          res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    })).catch((err) => res.status(400).send({ message: err }));
};

export const updateUserData = (req: SessionRequest, res: Response) => {
  const userData = {
    name: req.body.name,
    about: req.body.about,
    email: req.body.email,
  };
  const notEmptyUserData = Object.fromEntries(Object.entries(userData)
    .filter(([, value]) => value));

  return User.findByIdAndUpdate(req.user?._id, notEmptyUserData, { new: true, runValidators: true })
    .select('+email')
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (true) {
        case err.name === 'ValidationError':
          res.status(statusCodes.BAD_REQUEST).send({ message: 'Данные пользователя введены некорректно' });
          break;
        case err.name === 'CastError':
          res.status(statusCodes.BAD_REQUEST).send({ message: 'Передан невалидный _id' });
          break;
        case err.message === 'NotFound':
          res.status(statusCodes.NOT_FOUND).send({ message: 'Пользователь с указанным _id не существует' });
          break;
        default:
          res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

export const updateUserAvatar = (req: SessionRequest, res: Response) => User.findByIdAndUpdate(
  req.user?._id,
  { avatar: req.body.avatar },
  { new: true, runValidators: true },
)
  .orFail(new Error('NotFound'))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    switch (true) {
      case err.name === 'ValidationError':
        res.status(statusCodes.BAD_REQUEST).send({ message: 'Данные для смены аватара введены некорректно' });
        break;
      case err.name === 'CastError':
        res.status(statusCodes.BAD_REQUEST).send({ message: 'Передан невалидный _id' });
        break;
      case err.message === 'NotFound':
        res.status(statusCodes.NOT_FOUND).send({ message: 'Пользователь с указанным _id не существует' });
        break;
      default:
        res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

export const getMyProfile = (req: SessionRequest, res: Response) => User.findById(req.user?._id)
  .select('+email')
  .orFail(new Error('NotFound'))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    switch (true) {
      case err.name === 'ValidationError':
        res.status(statusCodes.BAD_REQUEST).send({ message: 'Данные для смены аватара введены некорректно' });
        break;
      case err.name === 'CastError':
        res.status(statusCodes.BAD_REQUEST).send({ message: 'Передан невалидный _id' });
        break;
      case err.message === 'NotFound':
        res.status(statusCodes.NOT_FOUND).send({ message: 'Пользователь с указанным _id не существует' });
        break;
      default:
        res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

export const login = (req: userRequest, res: Response) => {
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
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
