import fs from 'fs';
import path from 'path';

const favoritesFilePath = path.join(__dirname, '../../data/favorites.json');

// Ensure the data directory exists to prevent errors on the first run
const dataDir = path.dirname(favoritesFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const readFavorites = (): string[] => {
  if (!fs.existsSync(favoritesFilePath)) {
    return [];
  }

  const data = fs.readFileSync(favoritesFilePath, 'utf-8');

  // **THE FIX**: Check if the file is empty before parsing
  if (data.trim() === '') {
    return [];
  }

  // **Best Practice**: Gracefully handle malformed JSON
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing favorites.json, returning empty array.', error);
    return [];
  }
};

const writeFavorites = (favorites: string[]) => {
  fs.writeFileSync(favoritesFilePath, JSON.stringify(favorites, null, 2));
};

export const getFavoriteBreeds = (): string[] => {
  return readFavorites();
};

export const addFavoriteBreed = (breed: string) => {
  const favorites = readFavorites();
  if (!favorites.includes(breed)) {
    favorites.push(breed);
    writeFavorites(favorites);
  }
};

export const removeFavoriteBreed = (breed: string) => {
  let favorites = readFavorites();
  favorites = favorites.filter(fav => fav !== breed);
  writeFavorites(favorites);
};