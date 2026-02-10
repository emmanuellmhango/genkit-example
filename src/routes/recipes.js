import express from 'express';
import { recipeGeneratorFlow, RecipeInputSchema } from '../ai/recipeFlow.js';
const router = express.Router();
router.post('/', async (req, res) => {
    try {
        // Validate input using Zod
        const input = RecipeInputSchema.parse(req.body);
        const recipe = await recipeGeneratorFlow(input);
        res.json(recipe);
    }
    catch (err) {
        res.status(400).json({
            error: err.message ?? 'Invalid request',
        });
    }
});
export default router;
//# sourceMappingURL=recipes.js.map