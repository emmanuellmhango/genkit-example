import express from 'express';
import { recipeGeneratorFlow, RecipeInputSchema } from '../ai/recipeFlow.js';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Request body:', req.body);
  try {
    const input = RecipeInputSchema.parse(req.body);
    // generate recipe...
    const recipe = await recipeGeneratorFlow(input);

    res.json(recipe);
  } catch (err: any) {
    console.error('Zod error:', err.errors);
    res.status(400).json({ error: err.message, details: err.errors });
  }
});

export default router;
