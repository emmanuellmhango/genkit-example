import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', {
    temperature: 0.7,
  }),
});

// Input schema
export const InsightsInputSchema = z.object({
  data: z.array(
    z.object({
      date: z.string(),
      district: z.string(),
      water: z.number().optional(),
      temp: z.number().optional(),
      cond: z.number().optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
      name: z.string().optional(),
    })
  ),
  metric: z.enum(['water', 'temp', 'cond']),
  forecastYears: z.number().min(1).max(10).default(5),
});

// Output schema
export const InsightsSchema = z.object({
  summary: z.string(),
  recommendations: z.array(z.string()),
});

// Flow
export const insightsGeneratorFlow = ai.defineFlow(
  {
    name: 'insightsGeneratorFlow',
    inputSchema: InsightsInputSchema,
    outputSchema: InsightsSchema,
  },
  async (input) => {
    const prompt = `
      You are an environmental data analyst.

      Analyze the dataset below for metric: ${input.metric}.
      Provide:
      1. A concise analytical summary
      2. Forecast implications for the next ${input.forecastYears} years
      3. Actionable policy recommendations

      Dataset:
      ${JSON.stringify(input.data)}
    `;

    const { output } = await ai.generate({
      prompt,
      output: { schema: InsightsSchema },
    });

    if (!output) throw new Error('Insight generation failed');

    return output;
  }
);
