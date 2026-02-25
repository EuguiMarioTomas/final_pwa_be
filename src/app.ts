import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoute.js';
import reminderRoutes from './routes/reminderRoute.js';

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/reminders', reminderRoutes);
app.get('/', (_, res) => {
  res.json('API is running...');
});

export default app;