import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // This will be our backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  getBreeds: () => apiClient.get('/breeds'),
  getBreedImages: (breed: string) => apiClient.get(`/breeds/${breed}/images`),
  getFavorites: () => apiClient.get('/favorites'),
  addFavorite: (breed: string) => apiClient.post('/favorites', { breed }),
  removeFavorite: (breed: string) => apiClient.delete(`/favorites/${breed}`),
};