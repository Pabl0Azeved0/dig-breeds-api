import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './swaggerDef';

import breedRoutes from './routes/breedRoutes';
import favoriteRoutes from './routes/favoriteRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', breedRoutes);
app.use('/api', favoriteRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

export default app;