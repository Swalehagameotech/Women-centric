import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.config.js';
import Product from './model/product.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';
import cartRoutes from './routes/cart.routes.js';
import addressRoutes from './routes/address.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Women-centric API is running' });
});

app.get('/api/health', async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.json({
      ok: true,
      mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      productCount,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET is not set in .env — auth will fail.');
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
