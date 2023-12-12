import { Router } from 'express';
import {
  likeCard,
  dislikeCard,
  findCards,
  createCard,
  deleteCard,
} from '../controllers/cards';
import { validateCreateCard } from '../validators/cards';

const router = Router();

router.post('/', validateCreateCard, createCard);
router.get('/', findCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
