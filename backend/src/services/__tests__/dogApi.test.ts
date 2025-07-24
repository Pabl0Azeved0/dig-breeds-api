import axios from 'axios';
import { cache } from '../../utils/cache';
import { fetchAllBreeds, fetchBreedImages, fetchSingleBreedImage } from '../dogApi';

// Mock both axios and our cache utility
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../../utils/cache');
const mockedCache = cache as jest.Mocked<typeof cache>;

describe('Dog API Service', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('fetchAllBreeds', () => {
    it('should return cached breeds if available', async () => {
      const mockBreeds = ['retriever', 'husky'];
      mockedCache.get.mockReturnValue(mockBreeds);

      const result = await fetchAllBreeds();

      expect(result).toEqual(mockBreeds);
      expect(mockedCache.get).toHaveBeenCalledWith('allBreeds');
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should fetch from the API if not cached', async () => {
      mockedCache.get.mockReturnValue(null);
      mockedAxios.get.mockResolvedValue({ data: { message: { retriever: [], husky: [] } } });

      const result = await fetchAllBreeds();

      expect(result).toEqual(['retriever', 'husky']);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedCache.set).toHaveBeenCalledWith('allBreeds', ['retriever', 'husky'], 3600);
    });
  });

  describe('fetchSingleBreedImage', () => {
    it('should return a single image URL when the API call is successful', async () => {
      const imageUrl = 'https://images.dog.ceo/breeds/akita/akita_01.jpg';
      mockedAxios.get.mockResolvedValue({ data: { message: [imageUrl] } });

      const result = await fetchSingleBreedImage('akita');
      expect(result).toBe(imageUrl);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should return null if the API returns an empty message array', async () => {
      mockedAxios.get.mockResolvedValue({ data: { message: [] } });

      const result = await fetchSingleBreedImage('akita');
      expect(result).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Failure'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await fetchSingleBreedImage('akita');
      expect(result).toBeNull();
      
      consoleSpy.mockRestore();
    });
  });

  describe('fetchBreedImages', () => {
    it('should return cached images if available', async () => {
      const mockImages = ['url1.jpg', 'url2.jpg'];
      mockedCache.get.mockReturnValue(mockImages);

      const result = await fetchBreedImages('akita');

      expect(result).toEqual(mockImages);
      expect(mockedCache.get).toHaveBeenCalledWith('breedImages_akita');
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should fetch from the API if not cached', async () => {
      const apiResult = ['url1.jpg', 'url2.jpg', 'url3.jpg'];
      mockedCache.get.mockReturnValue(null);
      mockedAxios.get.mockResolvedValue({ data: { message: apiResult } });

      const result = await fetchBreedImages('akita');

      expect(result).toEqual(apiResult);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedCache.set).toHaveBeenCalledWith('breedImages_akita', apiResult, 600);
    });
  });

  describe('fetchSingleBreedImage', () => {
    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Failure'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await fetchSingleBreedImage('akita');
      expect(result).toBeNull();
      
      consoleSpy.mockRestore();
    });
  });
});