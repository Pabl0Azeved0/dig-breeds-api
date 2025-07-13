import { Request, Response } from 'express';
import * as favoriteService from '../services/favoriteService';

export const getFavorites = (req: Request, res: Response) => {
  res.json(favoriteService.getFavoriteBreeds());
};

export const addFavorite = (req: Request, res: Response) => {
  const { breed } = req.body;
  if (!breed) {
    return res.status(400).json({ message: 'Breed is required' });
  }
  favoriteService.addFavoriteBreed(breed);
  res.status(201).send();
};

export const removeFavorite = (req: Request, res: Response) => {
  const { breed } = req.params;
  favoriteService.removeFavoriteBreed(breed);
  res.status(204).send();
};