import axios from 'axios';
import { cache } from '../utils/cache';

const DOG_API_URL = 'https://dog.ceo/api';

export const fetchAllBreeds = async (): Promise<string[]> => {
  const cachedBreeds = cache.get('allBreeds');
  if (cachedBreeds) return cachedBreeds as string[];

  const response = await axios.get(`${DOG_API_URL}/breeds/list/all`);
  const breeds = Object.keys(response.data.message);
  cache.set('allBreeds', breeds, 3600); // Cache for 1 hour
  return breeds;
};

export const fetchBreedImages = async (breed: string): Promise<string[]> => {
    const cacheKey = `breedImages_${breed}`;
    const cachedImages = cache.get(cacheKey);
    if (cachedImages) return cachedImages as string[];

    const response = await axios.get(`${DOG_API_URL}/breed/${breed}/images/random/3`);
    const images = response.data.message;
    cache.set(cacheKey, images, 600); // Cache for 10 minutes
    return images;
};