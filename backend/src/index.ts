import express from 'express';
import cors from 'cors';
import breedRoutes from './routes/breedRoutes';
import favoriteRoutes from './routes/favoriteRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', breedRoutes);
app.use('/api', favoriteRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});