import { Request, Response } from 'express';
import User from '../models/user';
import { CustomRequest } from '../types/customRequestType';

export const findUsers = (req: Request, res: Response) => User.find({})
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));

export const findUserById = (req: Request, res: Response) => User.findById(req.params.userId)
  .then((user) => {
    if (!user?._id) {
      return res.status(404).send({ message: 'Пользователь с указанным _id не существует' });
    }
    return res.send({ data: user });
  })
  .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));

export const createUser = (req: Request, res: Response) => User.create({
  name: req.body.name,
  avatar: req.body.avatar,
  about: req.body.about,
})
  .then((user) => { res.send({ data: user }); })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Данные пользователя введены некорректно' });
    }
    return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  });

export const updateUserData = (req: CustomRequest, res: Response) => {
  const userData = {
    name: req.body.name,
    about: req.body.about,
  };
  const notEmptyUserData = Object.fromEntries(Object.entries(userData)
    .filter(([, value]) => value));

  return User.findByIdAndUpdate(req.user?._id, notEmptyUserData, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(400).send({ message: 'Данные пользователя введены некорректно' });
          break;
        case 'CastError':
          res.status(404).send({ message: 'Пользователь с указанным _id не существует' });
          break;
        default:
          res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

export const updateUserAvatar = (req: CustomRequest, res: Response) => User.findByIdAndUpdate(
  req.user?._id,
  { avatar: req.body.avatar },
  { new: true, runValidators: true },
)
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    switch (err.name) {
      case 'ValidationError':
        res.status(400).send({ message: 'Данные для смены аватара введены некорректно' });
        break;
      case 'CastError':
        res.status(404).send({ message: 'Пользователь с указанным _id не существует' });
        break;
      default:
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  });