import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', { temperature: 0.6 }),
});

export const InterrogateInputSchema = z.object({
  question: z.string(),
  metric: z.string(),
  currentSelection: z.array(z.any()),
});

export const InterrogateOutputSchema = z.object({
  answer: z.string(),
  requiresGraph: z.boolean().optional(),
  graphType: z.string().optional(),
});

export const interrogateFlow = ai.defineFlow(
  {
    name: 'interrogateFlow',
    inputSchema: InterrogateInputSchema,
    outputSchema: InterrogateOutputSchema,
  },
  async (input) => {

    const prompt = `
You are a groundwater policy and data analyst.

Metric under analysis: ${input.metric}

User Question:
"${input.question}"

Current Filtered Data:
${JSON.stringify(input.currentSelection.slice(0, 300), null, 2)}

Instructions:
- If the question requires comparison, compare appropriately.
- If the question requires a graph, indicate requiresGraph = true and suggest graphType.
- Provide a technically sound answer.
- Be concise but analytical.

Respond strictly according to the schema.
`;

    const { output } = await ai.generate({
      prompt,
      output: { schema: InterrogateOutputSchema },
    });

    if (!output) throw new Error('Interrogation failed');

    return output;
  }
);
