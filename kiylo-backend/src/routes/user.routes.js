import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('super_admin')); // Strictly Super Admin for user/role management

router.get('/', userController.listUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.put('/:id/roles', userController.updateRoles);
router.delete('/:id', userController.deleteUser);

export default router;
