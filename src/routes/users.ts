import { Router } from 'express';
import { validateUpdateUserAvatar, validateUpdateUserData, validateUserId } from '../validators/users';
import {
  findUserById, findUsers, getMyProfile, updateUserAvatar, updateUserData,
} from '../controllers/users';

const router = Router();

router.get('/', findUsers);
router.get('/me', getMyProfile);
router.get('/:userId', validateUserId, findUserById);
router.patch('/me', validateUpdateUserData, updateUserData);
router.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

export default router;
