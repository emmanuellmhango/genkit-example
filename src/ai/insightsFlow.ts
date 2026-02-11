import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', {
    temperature: 0.7,
  }),
});

// Input schema
export const InsightInputSchema = z.object({
  metric: z.string(),
  forecastYears: z.number(),
  analysis: z.object({
    count: z.number(),
    mean: z.number(),
    min: z.number(),
    max: z.number(),
    variance: z.number(),
    slope: z.number(),
    trend: z.string(),
  }),
});

// Output schema
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

Statistical Summary:
- Data points: ${input.analysis.count}
- Mean: ${input.analysis.mean}
- Min: ${input.analysis.min}
- Max: ${input.analysis.max}
- Variance: ${input.analysis.variance}
- Slope: ${input.analysis.slope}
- Trend: ${input.analysis.trend}

Provide:
1. Executive summary (technical tone)
2. Risk classification (low, moderate, high)
3. Clear policy actions
4. Additional policy considerations

Respond strictly according to schema.
`;

    const { output } = await ai.generate({
      prompt,
      output: { schema: InsightOutputSchema },
    });

    if (!output) throw new Error('Insight generation failed');

    return output;
  }
);

