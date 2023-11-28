import { Request, Response } from 'express';
import statusCodes from '../constants/statusCodes';
import Card from '../models/card';
import { CustomRequest } from '../types/customRequestType';

export const findCards = (req: Request, res: Response) => Card.find({})
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));

export const createCard = (req: CustomRequest, res: Response) => {
  const id = req.user?._id;
  return Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: id,
    likes: [],
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(statusCodes.BAD_REQUEST).send({ message: 'Данные введены некорректно' });
      }
      return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    });
};

export const deleteCard = (req: Request, res: Response) => Card.findByIdAndDelete(req.params.cardId)
  .then(() => res.send({ message: 'Карточка удалена успешно' }))
  .catch(() => res.status(statusCodes.NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' }));

export const likeCard = (req: CustomRequest, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user?._id } },
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    switch (err.name) {
      case 'ValidationError':
        res.status(statusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
        break;
      case 'CastError':
        res.status(statusCodes.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        break;
      default:
        res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

export const dislikeCard = (req: CustomRequest, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user?._id } },
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    switch (err.name) {
      case 'ValidationError':
        res.status(statusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка' });
        break;
      case 'CastError':
        res.status(statusCodes.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        break;
      default:
        res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });
