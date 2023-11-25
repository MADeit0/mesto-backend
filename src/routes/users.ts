import { Router } from 'express';
import User from '../models/user';
import { CustomRequest } from '../types/customRequestType';

const router = Router();

router.get('/', (_req, res) => User.find({})
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' })));

router.get('/:userId', (req, res) => User.findById(req.params.userId)
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' })));

router.post('/', (req, res) => User.create({
  name: req.body.name,
  avatar: req.body.avatar,
  about: req.body.about,
})
  .then((user) => res.send({ data: user }))
  .catch((err) => res.status(400).send(err)));

router.patch('/me', (req: CustomRequest, res) => {
  const userData = {
    name: req.body.name,
    about: req.body.about,
  };
  const notEmptyData = Object.fromEntries(Object.entries(userData).filter(([, value]) => value));

  return User.findByIdAndUpdate(req.user?._id, notEmptyData)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Пользователь не существует' }));
});

router.patch('/me/avatar', (req: CustomRequest, res) => User.findByIdAndUpdate(req.user?._id, { avatar: req.body.avatar }, { new: true })
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(400).send({ message: 'Пользователь не существует' })));

export default router;
