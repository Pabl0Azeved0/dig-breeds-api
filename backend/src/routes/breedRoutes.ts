import { Router } from 'express';
import { getAllBreeds, getBreedImages, getSingleBreedImage } from '../controllers/breedController';

const router = Router();

router.get('/breeds', getAllBreeds);
router.get('/breeds/:breed/images', getBreedImages);
router.get('/breeds/:breed/image', getSingleBreedImage);

export default router;