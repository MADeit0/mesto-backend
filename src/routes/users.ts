import { Router } from 'express';
import User from '../models/user';

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
})
  .then((user) => res.send(user))
  .catch((err) => res.status(400).send(err)));

export default router;

// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя
