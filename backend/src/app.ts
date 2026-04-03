import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({
  origin(origin, callback) {
    const allowed = process.env.FRONTEND_URL || 'http://localhost:3000';
    // Allow requests with no origin (curl, Postman) or from allowed origins
    if (!origin || origin === allowed || origin.match(/^http:\/\/localhost:\d+$/)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

export default app;
