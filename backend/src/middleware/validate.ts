import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

type Validator = (body: Record<string, unknown>) => string | null;

export function validate(validator: Validator) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const error = validator(req.body as Record<string, unknown>);
    if (error) {
      throw new AppError(400, error);
    }
    next();
  };
}
