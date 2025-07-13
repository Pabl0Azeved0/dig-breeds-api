import { Request, Response } from 'express';
import { fetchAllBreeds, fetchBreedImages } from '../services/dogApi';

export const getAllBreeds = async (req: Request, res: Response) => {
  try {
    const breeds = await fetchAllBreeds();
    res.json(breeds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching breeds' });
  }
};

export const getBreedImages = async (req: Request, res: Response) => {
  try {
    const { breed } = req.params;
    const images = await fetchBreedImages(breed);
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching breed images' });
  }
};