import { Router } from 'express';
import {
  getAdminOrderById,
  getAllUsers,
  getAllOrders,
  updateAdminOrderStatus,
  updateAdminUserPassword,
} from '../controller/admin.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protect, requireAdmin);

router.get('/users', getAllUsers);
router.patch('/users/:id/password', updateAdminUserPassword);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getAdminOrderById);
router.patch('/orders/:id', updateAdminOrderStatus);

export default router;
