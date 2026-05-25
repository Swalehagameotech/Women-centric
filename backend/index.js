import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.config.js';
import categoryRoutes from './routes/category.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Women-centric API is running' });
});

app.use('/api/categories', categoryRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
