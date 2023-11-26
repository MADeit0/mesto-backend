import { Request, Response } from 'express';
import Card from '../models/card';
import { CustomRequest } from '../types/customRequestType';

export const findCards = (req: Request, res: Response) => Card.find({})
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));

export const createCard = (req: CustomRequest, res: Response) => {
  const id = req.user?._id;
  return Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: id,
    likes: [],
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(400).send(err));
};

export const deleteCard = (req: Request, res: Response) => Card.findByIdAndDelete(req.params.cardId)
  .then(() => res.send({ message: 'Карточка удалена успешно' }))
  .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));

export const likeCard = (req: CustomRequest, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user?._id } },
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));

export const dislikeCard = (req: CustomRequest, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user?._id } },
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
