use server';

/**
 * @fileOverview Explains JavaScript code snippets or variable names.
 *
 * - explainCode - A function that explains the given JavaScript code or variable name.
 * - ExplainCodeInput - The input type for the explainCode function.
 * - ExplainCodeOutput - The return type for the explainCode function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ExplainCodeInputSchema = z.object({
  code: z.string().describe('The JavaScript code snippet or variable name to explain.'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
  explanation: z.string().describe('The AI-generated explanation of the code or variable name.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: {
    schema: z.object({
      code: z.string().describe('The JavaScript code snippet or variable name to explain.'),
    }),
  },
  output: {
    schema: z.object({
      explanation: z.string().describe('The AI-generated explanation of the code or variable name.'),
    }),
  },
  prompt: `You are a JavaScript expert. Explain the following code or variable name:

  {{code}}
  `,
});

const explainCodeFlow = ai.defineFlow<
  typeof ExplainCodeInputSchema,
  typeof ExplainCodeOutputSchema
>({
  name: 'explainCodeFlow',
  inputSchema: ExplainCodeInputSchema,
  outputSchema: ExplainCodeOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
}
);
