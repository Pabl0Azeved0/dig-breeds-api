import fs from 'fs';
import path from 'path';

const favoritesFilePath = path.join(__dirname, '../../data/favorites.json');

const readFavorites = (): string[] => {
  if (!fs.existsSync(favoritesFilePath)) {
    return [];
  }
  const data = fs.readFileSync(favoritesFilePath, 'utf-8');
  return JSON.parse(data);
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