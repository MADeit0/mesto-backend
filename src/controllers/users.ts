import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import statusCodes from '../constants/statusCodes';
import User, { IUser } from '../models/user';
import { CustomRequest } from '../types/customRequestType';

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
      if (err.name === 'ValidationError') {
        return res.status(statusCodes.BAD_REQUEST).send({ message: 'Данные пользователя введены некорректно' });
      }
      return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    })).catch((err) => res.status(400).send({ message: err }));
};

export const updateUserData = (req: CustomRequest, res: Response) => {
  const userData = {
    name: req.body.name,
    about: req.body.about,
  };
  const notEmptyUserData = Object.fromEntries(Object.entries(userData)
    .filter(([, value]) => value));

  return User.findByIdAndUpdate(req.user?._id, notEmptyUserData, { new: true, runValidators: true })
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

export const updateUserAvatar = (req: CustomRequest, res: Response) => User.findByIdAndUpdate(
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
