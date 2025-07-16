import { Request, Response } from 'express';
import { fetchAllBreeds, fetchBreedImages, fetchSingleBreedImage } from '../services/dogApi';

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

export const getSingleBreedImage = async (req: Request, res: Response) => {
  try {
    const { breed } = req.params;
    const imageUrl = await fetchSingleBreedImage(breed);
    if (imageUrl) {
      res.json({ imageUrl });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching breed image' });
  }
};