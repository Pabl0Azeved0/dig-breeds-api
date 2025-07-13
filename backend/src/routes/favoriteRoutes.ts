import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController';

const router = Router();

router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:breed', removeFavorite);

export default router;