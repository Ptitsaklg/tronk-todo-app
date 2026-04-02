import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';
import { users } from '../data/store';
import { LoginDto } from '../dto/auth.dto';
import { AppError } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '24h') as StringValue;

export function login(req: Request, res: Response): void {
  const { email, password } = req.body as LoginDto;

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
}
