import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoute.js';

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.get('/', (_, res) => {
  res.json('API is running...');
});
app.use('/api/users', userRoutes);
//app.use();
//app.use();

export default app;