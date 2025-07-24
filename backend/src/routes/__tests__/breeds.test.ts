import request from 'supertest';
import app from '../../app';
import * as dogApiService from '../../services/dogApi';

describe('Breeds API', () => {
  afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks();
  });

  // --- Success Paths ---
  it('GET /api/breeds -> should return an array of breeds', async () => {
    const response = await request(app).get('/api/breeds');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('GET /api/breeds/:breed/images -> should return an array of 3 image URLs', async () => {
    const response = await request(app).get('/api/breeds/akita/images');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(3);
  });

  it('GET /api/breeds/:breed/image -> should return a single image URL object', async () => {
    const response = await request(app).get('/api/breeds/akita/image');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('imageUrl');
    expect(typeof response.body.imageUrl).toBe('string');
  });

  // --- Error Paths ---
  it('GET /api/breeds -> should handle errors', async () => {
    jest.spyOn(dogApiService, 'fetchAllBreeds').mockImplementation(() => {
      throw new Error('Test Error');
    });
    const response = await request(app).get('/api/breeds');
    expect(response.statusCode).toBe(500);
  });
  
  it('GET /api/breeds/:breed/images -> should handle errors', async () => {
    jest.spyOn(dogApiService, 'fetchBreedImages').mockImplementation(() => {
      throw new Error('Test Error');
    });
    const response = await request(app).get('/api/breeds/akita/images');
    expect(response.statusCode).toBe(500);
  });

  it('GET /api/breeds/:breed/image -> should handle errors', async () => {
    jest.spyOn(dogApiService, 'fetchSingleBreedImage').mockImplementation(() => {
      throw new Error('Test Error');
    });
    const response = await request(app).get('/api/breeds/akita/image');
    expect(response.statusCode).toBe(500);
  });

  it('GET /api/breeds/:breed/image -> should handle a 404 not found', async () => {
    jest.spyOn(dogApiService, 'fetchSingleBreedImage').mockResolvedValue(null);
    const response = await request(app).get('/api/breeds/nonexistentbreed/image');
    expect(response.statusCode).toBe(404);
  });
});