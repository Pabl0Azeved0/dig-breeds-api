import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { z } from 'zod';

// Zod schema for adding a favorite
const favoriteSchema = z.object({
  breed: z.string().min(1, 'Breed is required'),
});

// Middleware to validate the POST /api/favorites body
export const validateAddFavorite = [
  body('breed').isString().notEmpty().withMessage('Breed is required and must be a string'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware to validate the DELETE /api/favorites/:breed param
export const validateRemoveFavorite = [
  param('breed').isString().notEmpty().withMessage('Breed parameter is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];