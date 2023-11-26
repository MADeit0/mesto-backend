import { Router } from 'express';
import Card from '../models/card';
import { CustomRequest } from '../types/customRequestType';
import { likeCard, dislikeCard } from '../controllers/card';

const router = Router();

router.get('/', (_req, res) => Card.find({})
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(400).send({ message: 'Произошла ошибка' })));

router.post('/', (req: CustomRequest, res) => {
  const id = req.user?._id;
  return Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: id,
    likes: [],
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(400).send(err));
});

router.delete('/:cardId', (req, res) => Card.findByIdAndDelete(req.params.cardId)
  .then(() => res.send({ message: 'Карточка удалена успешно' }))
  .catch(() => res.status(400).send({ message: 'Произошла ошибка' })));

router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
