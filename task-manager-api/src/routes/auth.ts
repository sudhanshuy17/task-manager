import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "super-refresh-key";

// post /auth/register
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Checking if useralready exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // password  hashing and save to DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error Details:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// post /auth/login
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // generate tokens
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
  // post /auth/refresh
  router.post("/refresh", async (req: Request, res: Response): Promise<any> => {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as {
        userId: number;
      };

      const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
        expiresIn: "15m",
      });

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ error: "Invalid or expired refresh token" });
    }
  });
});

export default router;
