import { Router} from 'express';    
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// 1. Authentication Middleware
// This protects all task routes below it.
const authenticateToken = (req: Request, res: Response, next: NextFunction): any => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user: any) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    (req as any).user = user; // Attach the decoded user payload to the request
    next();
  });
};

router.use(authenticateToken); // Apply the middleware

// 2. GET /tasks (With Pagination, Filtering, and Searching)
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const { status, search, page = '1', limit = '10' } = req.query;

    const pageNumber = parseInt(page as string);
    const pageSize = parseInt(limit as string);

    const whereClause: any = { userId };
    if (status) whereClause.status = status;
    if (search) {
      whereClause.title = { contains: search as string };
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (error) {
    console.error("GET TASKS ERROR:", error); // <-- This will show in your backend terminal!
    res.status(500).json({ error: "Database error while fetching tasks" });
  }
});

// 3. POST /tasks
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const { title, description } = req.body;

    const newTask = await prisma.task.create({
      data: { title, description, userId }
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error("CREATE TASK ERROR:", error); // <-- This will show in your backend terminal!
    res.status(500).json({ error: "Database error while creating task" });
  }
});
// 4. GET /tasks/:id
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const userId = (req as any).user.userId;

  if (!id || typeof id !== 'string') return res.status(400).json({ error: "Invalid task ID" });

  const task = await prisma.task.findFirst({
    where: { id: parseInt(id), userId }
  });

  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// 5. PATCH /tasks/:id
router.patch('/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const userId = (req as any).user.userId;
  const { title, description, status } = req.body;

  if (!id || typeof id !== 'string') return res.status(400).json({ error: "Invalid task ID" });

  try {
    const updatedTask = await prisma.task.updateMany({
      where: { id: parseInt(id), userId }, // Ensures user owns the task
      data: { title, description, status }
    });

    if (updatedTask.count === 0) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

// 6. PATCH /tasks/:id/toggle
router.patch('/:id/toggle', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const userId = (req as any).user.userId;

  if (!id || typeof id !== 'string') return res.status(400).json({ error: "Invalid task ID" });

  // First, find the task to get its current status
  const task = await prisma.task.findFirst({ where: { id: parseInt(id), userId } });
  if (!task) return res.status(404).json({ error: "Task not found" });

  const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';

  await prisma.task.update({
    where: { id: task.id },
    data: { status: newStatus }
  });

  res.json({ message: `Task marked as ${newStatus}` });
});

// 7. DELETE /tasks/:id
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const userId = (req as any).user.userId;

  if (!id || typeof id !== 'string') return res.status(400).json({ error: "Invalid task ID" });

  try {
    const deletedTask = await prisma.task.deleteMany({
      where: { id: parseInt(id), userId }
    });

    if (deletedTask.count === 0) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Deletion failed" });
  }
});

export default router;