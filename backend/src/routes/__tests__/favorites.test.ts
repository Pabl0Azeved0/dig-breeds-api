import request from 'supertest';
import app from '../../app';
import fs from 'fs';
import path from 'path';

const favoritesFilePath = path.join(__dirname, '../../../data/favorites.json');

// This cleanup function will now work correctly
beforeEach(() => {
  // Ensure the data directory exists
  const dataDir = path.dirname(favoritesFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  // Start with an empty array for each test
  fs.writeFileSync(favoritesFilePath, '[]', 'utf-8');
});

afterEach(() => {
  fs.writeFileSync(favoritesFilePath, '[]', 'utf-8');
});

describe('Favorites API', () => {
  it('should handle the full favorites lifecycle', async () => {
    // 1. Initially, favorites should be empty
    let response = await request(app).get('/api/favorites');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);

    // 2. Add a new favorite
    const newFavorite = { breed: 'husky' };
    response = await request(app).post('/api/favorites').send(newFavorite);
    expect(response.statusCode).toBe(201);

    // 3. Get favorites and check if the new one is there
    response = await request(app).get('/api/favorites');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(['husky']);

    // 4. Remove the favorite
    response = await request(app).delete('/api/favorites/husky');
    expect(response.statusCode).toBe(204);

    // 5. Favorites should be empty again
    response = await request(app).get('/api/favorites');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('POST /api/favorites -> should return 400 if breed is not provided', async () => {
    const response = await request(app).post('/api/favorites').send({}); // Sending empty body
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: 'Breed is required' });
  });
});
