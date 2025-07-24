import fs from 'fs';
import * as favoriteService from '../favoriteService';

// Mock the entire fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('Favorite Service', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  it('readFavorites should return an empty array if file does not exist', () => {
    mockedFs.existsSync.mockReturnValue(false);
    const favorites = favoriteService.getFavoriteBreeds();
    expect(favorites).toEqual([]);
  });

  it('readFavorites should return an empty array if file is empty', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(''); // Simulate empty file
    const favorites = favoriteService.getFavoriteBreeds();
    expect(favorites).toEqual([]);
  });
  
  it('readFavorites should return an empty array if JSON is malformed', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue('{invalid-json}');

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const favorites = favoriteService.getFavoriteBreeds();
    expect(favorites).toEqual([]);

    consoleSpy.mockRestore();
  });

  it('addFavoriteBreed should not add a duplicate', () => {
    const initialFavorites = ['husky'];
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(JSON.stringify(initialFavorites));

    favoriteService.addFavoriteBreed('husky');

    // writeFileSync should not have been called because nothing changed
    expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
  });
});