import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', {
    temperature: 0.8,
  }),
});

// Input schema
export const RecipeInputSchema = z.object({
  ingredient: z.string(),
  dietaryRestrictions: z.string().optional(),
});

// Output schema
export const RecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  prepTime: z.string(),
  cookTime: z.string(),
  servings: z.number(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  tips: z.array(z.string()).optional(),
});

// Flow definition
export const recipeGeneratorFlow = ai.defineFlow(
  {
    name: 'recipeGeneratorFlow',
    inputSchema: RecipeInputSchema,
    outputSchema: RecipeSchema,
  },
  async (input) => {
    const prompt = `Create a recipe with:
    Main ingredient: ${input.ingredient}
    Dietary restrictions: ${input.dietaryRestrictions ?? 'none'}`;

    const { output } = await ai.generate({
      prompt,
      output: { schema: RecipeSchema },
    });

    if (!output) throw new Error('Recipe generation failed');

    return output;
  }
);
