import { Router } from 'express';
import {
  createUser, findUserById, findUsers, updateUserAvatar, updateUserData,
} from '../controllers/users';

const router = Router();

router.post('/', createUser);
router.get('/', findUsers);
router.get('/:userId', findUserById);
router.patch('/me', updateUserData);
router.patch('/me/avatar', updateUserAvatar);

export default router;
