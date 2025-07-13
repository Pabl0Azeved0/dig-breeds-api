import { Router } from 'express';
import { getAllBreeds, getBreedImages } from '../controllers/breedController';

const router = Router();

router.get('/breeds', getAllBreeds);
router.get('/breeds/:breed/images', getBreedImages);

export default router;