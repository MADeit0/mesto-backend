import { Request, Response } from 'express';
import Card from '../models/card';
import { CustomRequest } from '../types/customRequestType';

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
