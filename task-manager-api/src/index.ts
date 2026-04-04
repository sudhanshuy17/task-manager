import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import taskRouter from './routes/tasks';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRouter);

// A quick test route! Notice the `: Request` and `: Response` types.
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is healthy and running!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});