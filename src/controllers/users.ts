import { Request, Response } from 'express';
import statusCodes from '../constants/statusCodes';
import User from '../models/user';
import { CustomRequest } from '../types/customRequestType';

export const findUsers = (req: Request, res: Response) => User.find({})
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));

export const findUserById = (req: Request, res: Response) => User.findById(req.params.userId)
  .orFail(new Error('NotFound'))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    switch (true) {
      case err.name === 'CastError' || err.message === 'NotFound':
        res.status(statusCodes.NOT_FOUND).send({ message: 'Пользователь с указанным _id не существует' });
        break;
      default:
        res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

export const createUser = (req: Request, res: Response) => User.create({
  name: req.body.name,
  avatar: req.body.avatar,
  about: req.body.about,
})
  .then((user) => { res.send({ data: user }); })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(statusCodes.BAD_REQUEST).send({ message: 'Данные пользователя введены некорректно' });
    }
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  });

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
        case err.name === 'CastError' || err.message === 'NotFound':
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
      case err.name === 'CastError' || err.message === 'NotFound':
        res.status(statusCodes.NOT_FOUND).send({ message: 'Пользователь с указанным _id не существует' });
        break;
      default:
        res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });
