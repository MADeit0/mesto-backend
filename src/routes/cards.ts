import { Router } from 'express';
import {
  likeCard,
  dislikeCard,
  findCards,
  createCard,
  deleteCard,
} from '../controllers/cards';
import { validateCardId, validateCreateCard } from '../validators/cards';

const router = Router();

router.post('/', validateCreateCard, createCard);
router.get('/', findCards);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

export default router;
