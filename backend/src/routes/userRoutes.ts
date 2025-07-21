import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router: Router = Router();
const userController = new UserController();

// ユーザールート定義
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router; 