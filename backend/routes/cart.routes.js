import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controller/cart.controller.js';

const router = Router();

router.use(protect);

router.get('/', getMyCart);
router.post('/items', addToCart);
router.patch('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeCartItem);
router.delete('/', clearCart);

export default router;
