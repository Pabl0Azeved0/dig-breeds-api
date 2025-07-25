import axios from 'axios';
import CircuitBreaker from 'opossum';
import { cache } from '../utils/cache';

const DOG_API_URL = 'https://dog.ceo/api';

// Configuration for the circuit breaker
const circuitBreakerOptions = {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
};

// Create a single breaker for all calls to the Dog CEO API
const breaker = new CircuitBreaker(
  (url: string) => axios.get(url),
  circuitBreakerOptions
);

// Fallback for when the API is down: return an empty list of breeds
breaker.fallback(() => ({ data: { message: [] } }));

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
      for (const subBreed of subBreeds) {
        breedsList.push(`${breed}-${subBreed}`);
      }
    }
  }
  return breedsList;
};

export const fetchAllBreeds = async (): Promise<string[]> => {
  const cachedBreeds = cache.get('allBreeds');
  if (cachedBreeds) return cachedBreeds as string[];

  const response: any = await breaker.fire(`${DOG_API_URL}/breeds/list/all`);
  
  const breeds = processBreeds(response.data.message);
  cache.set('allBreeds', breeds, 3600);
  return breeds;
};

export const fetchBreedImages = async (breed: string): Promise<string[]> => {
    const cacheKey = `breedImages_${breed}`;
    const cachedImages = cache.get(cacheKey);
    if (cachedImages) return cachedImages as string[];

    const breedPath = breed.replace('-', '/');
    const response: any = await breaker.fire(`${DOG_API_URL}/breed/${breedPath}/images/random/3`);
    
    const images = response.data.message;
    cache.set(cacheKey, images, 600);
    return images;
};

export const fetchSingleBreedImage = async (breed: string): Promise<string | null> => {
  const breedPath = breed.replace('-', '/');
  try {
    const response: any = await breaker.fire(`${DOG_API_URL}/breed/${breedPath}/images/random/1`);
    return response.data.message[0] || null;
  } catch (error) {
    console.error(`Could not fetch image for ${breed}`, error);
    return null;
  }
};