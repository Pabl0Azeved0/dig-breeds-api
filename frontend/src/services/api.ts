import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  getBreeds: () => apiClient.get('/breeds'),
  getBreedImages: (breed: string) => apiClient.get(`/breeds/${breed}/images`),
  getBreedImage: (breed: string) => apiClient.get(`/breeds/${breed}/image`),
  getFavorites: () => apiClient.get('/favorites'),
  addFavorite: (breed: string) => apiClient.post('/favorites', { breed }),
  removeFavorite: (breed: string) => apiClient.delete(`/favorites/${breed}`),
};