import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', { temperature: 0.7 }),
});

// Input schema: raw data
export const InsightInputSchema = z.object({
  metric: z.enum(['water', 'temp', 'cond']), // <-- use enum instead of string
  forecastYears: z.number(),
  data: z.array(
    z.object({
      date: z.string(),
      water: z.number().optional(),
      temp: z.number().optional(),
      cond: z.number().optional(),
    })
  ),
});

// Output schema: same as before
export const InsightOutputSchema = z.object({
  executiveSummary: z.string(),
  riskLevel: z.enum(['low', 'moderate', 'high']),
  recommendedActions: z.array(z.string()),
  policyNotes: z.string(),
});

// Flow
export const insightFlow = ai.defineFlow(
  {
    name: 'insightFlow',
    inputSchema: InsightInputSchema,
    outputSchema: InsightOutputSchema,
  },
  async (input) => {
    const prompt = `
You are a groundwater policy analyst.

Metric: ${input.metric}
Forecast Horizon: ${input.forecastYears} years

Data points (date + value):
${input.data.map(d => `${d.date}: ${d[input.metric]}`).join('\n')}

Analyze the trend, risk, and provide actionable policy recommendations. Respond strictly according to the schema.
`;

    const { output } = await ai.generate({
      prompt,
      output: { schema: InsightOutputSchema },
    });

    if (!output) throw new Error('Insight generation failed');

    return output;
  }
);
