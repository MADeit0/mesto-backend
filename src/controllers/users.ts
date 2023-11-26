import { Request, Response } from 'express';
import User from '../models/user';
import { CustomRequest } from '../types/customRequestType';

export const findUsers = (req: Request, res: Response) => User.find({})
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const findUserById = (req: Request, res: Response) => User.findById(req.params.userId)
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const createUser = (req: Request, res: Response) => User.create({
  name: req.body.name,
  avatar: req.body.avatar,
  about: req.body.about,
})
  .then((user) => res.send({ data: user }))
  .catch((err) => res.status(400).send(err));

export const updateUserData = (req: CustomRequest, res: Response) => {
  const userData = {
    name: req.body.name,
    about: req.body.about,
  };
  const notEmptyUserData = Object.fromEntries(Object.entries(userData)
    .filter(([, value]) => value));

  return User.findByIdAndUpdate(req.user?._id, notEmptyUserData)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Пользователь не существует' }));
};

export const updateUserAvatar = (req: CustomRequest, res: Response) => User.findByIdAndUpdate(
  req.user?._id,
  { avatar: req.body.avatar },
  { new: true },
)
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(400).send({ message: 'Пользователь не существует' }));
