import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { CardRequest } from '../types';

import BadRequestError from '../errors/BadRequestError';
import ForbiddenRequestError from '../errors/ForbiddenRequestError';
import NotFoundError from '../errors/NotFoundError';

export const findCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((card) => res.send({ data: card }))
  .catch((err) => next(err));

export const createCard = (req: CardRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  return Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      switch (true) {
        case err.name === 'ValidationError':
          next(new BadRequestError('Данные введены некорректно'));
          break;
        default:
          next(err);
      }
    });
};

export const deleteCard = (
  req: CardRequest,
  res: Response,
  next: NextFunction,
) => Card.findById(req.params.cardId)
  .orFail(new NotFoundError('Передан несуществующий _id карточки'))
  .then((card) => {
    if (card.owner.toString() !== req.user?._id) {
      throw new ForbiddenRequestError('Нет прав на удаление этой карточки');
    }
    Card.findByIdAndDelete(req.params.cardId)
      .then(() => res.send({ message: 'Карточка удалена успешно' }));
  })
  .catch((err) => {
    switch (true) {
      case err.name === 'CastError':
        next(new BadRequestError('Передан невалидный _id'));
        break;
      default:
        next(err);
    }
  });

export const likeCard = (
  req: CardRequest,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user?._id } },
  { new: true },
).orFail(new NotFoundError('Передан несуществующий _id карточки'))
  .then((card) => res.send({ data: card.likes }))
  .catch((err) => {
    switch (true) {
      case err.name === 'CastError':
        next(new BadRequestError('Передан невалидный _id'));
        break;
      default:
        next(err);
    }
  });

export const dislikeCard = (
  req: CardRequest,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user?._id } },
  { new: true },
).orFail(new NotFoundError('Передан несуществующий _id карточки'))
  .then((card) => res.send({ data: card.likes }))
  .catch((err) => {
    switch (true) {
      case err.name === 'CastError':
        next(new BadRequestError('Передан невалидный _id'));
        break;
      default:
        next(err);
    }
  });
