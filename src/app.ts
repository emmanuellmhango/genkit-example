import express from 'express';
import recipesRouter from './routes/recipes.js';

const app = express();

app.use(express.json());

app.get('/', (_, res) => {
  res.json({ status: 'OK', service: 'Genkit Express API' });
});

app.use('/recipes', recipesRouter);

export default app;
