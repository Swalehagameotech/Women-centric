import { Router } from 'express';
import { getAllUsers, getAllOrders } from '../controller/admin.controller.js';

const router = Router();

router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);

export default router;
