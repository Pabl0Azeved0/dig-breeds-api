import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './swaggerDef';

import breedRoutes from './routes/breedRoutes';
import favoriteRoutes from './routes/favoriteRoutes';

const app = express();

app.use(helmet());

// Limit repeated requests to API endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', limiter);
app.use('/api', breedRoutes);
app.use('/api', favoriteRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

export default app;