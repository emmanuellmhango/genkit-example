import express from 'express';
import cors from 'cors';
import recipesRouter from './routes/recipes.js';
import insightsRoute from './routes/insights.js';

const app = express();

// Enable CORS for all origins (dev + prod)
app.use(cors());

// Parse JSON
app.use(express.json());

// Routes
app.get('/', (_, res) => {
  res.json({ status: 'OK', service: 'Genkit Express API' });
});
app.use('/recipes', recipesRouter);
app.use('/insights', insightsRoute);

export default app;
