import { Request, Response } from 'express';
import { fetchAllBreeds, fetchBreedImages, fetchSingleBreedImage } from '../services/dogApi';

// A helper to handle errors consistently
const handleError = (error: any, res: Response, defaultMessage: string) => {
  if (error && error.name === 'OpenCircuitError') {
    // The circuit is open, the external service is unavailable
    return res.status(503).json({ message: 'The Dog API is currently unavailable. Please try again later.' });
  }
  console.error(defaultMessage, error);
  res.status(500).json({ message: defaultMessage });
};

export const getAllBreeds = async (req: Request, res: Response) => {
  try {
    const breeds = await fetchAllBreeds();
    res.json(breeds);
  } catch (error) {
    handleError(error, res, 'Error fetching breeds');
  }
};

export const getBreedImages = async (req: Request, res: Response) => {
  try {
    const { breed } = req.params;
    const images = await fetchBreedImages(breed);
    res.json(images);
  } catch (error) {
    handleError(error, res, 'Error fetching breed images');
  }
};

export const getSingleBreedImage = async (req: Request, res: Response) => {
  try {
    const { breed } = req.params;
    const imageUrl = await fetchSingleBreedImage(breed);
    if (imageUrl) {
      res.json({ imageUrl });
    } else {
      res.status(404).json({ message: 'Image not found for this breed.' });
    }
  } catch (error) {
    handleError(error, res, 'Error fetching single breed image');
  }
};