import { Router } from 'express';
import {
  findUserById, findUsers, getMyProfile, updateUserAvatar, updateUserData,
} from '../controllers/users';

const router = Router();

router.get('/', findUsers);
router.get('/me', getMyProfile);
router.get('/:userId', findUserById);
router.patch('/me', updateUserData);
router.patch('/me/avatar', updateUserAvatar);

export default router;
