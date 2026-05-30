import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  cancelOrder,
  createOrder,
  getMyOrders,
  getOrderById,
} from '../controller/order.controller.js';

const router = Router();

router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.patch('/:id/cancel', cancelOrder);
router.get('/:id', getOrderById);

export default router;
