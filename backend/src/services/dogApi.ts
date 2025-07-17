import axios from 'axios';
import { cache } from '../utils/cache';

const DOG_API_URL = 'https://dog.ceo/api';

/**
 * Helper function to flatten the nested breed structure from the Dog CEO API.
 * Converts { "bulldog": ["boston", "english"] }
 * into ["bulldog-boston", "bulldog-english"]
 */
const processBreeds = (apiResponse: Record<string, string[]>): string[] => {
  const breedsList: string[] = [];
  for (const [breed, subBreeds] of Object.entries(apiResponse)) {
    if (subBreeds.length === 0) {
      breedsList.push(breed);
    } else {
      // Handle sub-breeds
      for (const subBreed of subBreeds) {
        // We use a hyphen to separate them in the frontend list
        breedsList.push(`${breed}-${subBreed}`);
      }
    }
  }
  return breedsList;
};

export const fetchAllBreeds = async (): Promise<string[]> => {
  const cachedBreeds = cache.get('allBreeds');
  if (cachedBreeds) return cachedBreeds as string[];

  const response = await axios.get(`${DOG_API_URL}/breeds/list/all`);
  // Use the helper function to process the response
  const breeds = processBreeds(response.data.message);
  cache.set('allBreeds', breeds, 3600); // Cache for 1 hour
  return breeds;
};

export const fetchBreedImages = async (breed: string): Promise<string[]> => {
    const cacheKey = `breedImages_${breed}`;
    const cachedImages = cache.get(cacheKey);
    if (cachedImages) return cachedImages as string[];

    // The Dog CEO API expects sub-breeds separated by a slash (e.g., breed/bulldog/boston/images)
    // We replace the hyphen we used for our flattened list with a slash for the API call.
    const breedPath = breed.replace('-', '/');

    const response = await axios.get(`${DOG_API_URL}/breed/${breedPath}/images/random/3`);
    const images = response.data.message;
    cache.set(cacheKey, images, 600); // Cache for 10 minutes
    return images;
};

export const fetchSingleBreedImage = async (breed: string): Promise<string | null> => {
  try {
    const breedPath = breed.replace('-', '/');
    const response = await axios.get(`${DOG_API_URL}/breed/${breedPath}/images/random/1`);
    return response.data.message[0] || null;
  } catch (error) {
    console.error(`Could not fetch image for ${breed}`, error);
    return null;
  }
};