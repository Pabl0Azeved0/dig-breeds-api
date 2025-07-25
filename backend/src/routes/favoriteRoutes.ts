import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController';
import { validateAddFavorite, validateRemoveFavorite } from '../middleware/validation';

const router = Router();

router.get('/favorites', getFavorites);
router.post('/favorites', validateAddFavorite, addFavorite);
router.delete('/favorites/:breed', validateRemoveFavorite, removeFavorite);

export default router;