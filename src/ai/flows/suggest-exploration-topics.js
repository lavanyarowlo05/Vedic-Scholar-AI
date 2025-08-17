'use server';

/**
 * @fileOverview A flow to suggest related topics for further exploration of Hindu mythology.
 *
 * - suggestExplorationTopics - A function that suggests related topics.
 * - SuggestExplorationTopicsInput - The input type for the suggestExplorationTopics function.
 * - SuggestExplorationTopicsOutput - The return type for the suggestExplorationTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestExplorationTopicsInputSchema = z.object({
  topic: z.string().describe('The current topic the user is exploring.'),
});


const SuggestExplorationTopicsOutputSchema = z.object({
  suggestedTopics: z
    .array(z.string())
    .describe('An array of suggested topics related to the current topic.'),
});


export async function suggestExplorationTopics(input) {
  return suggestExplorationTopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestExplorationTopicsPrompt',
  input: {schema: SuggestExplorationTopicsInputSchema},
  output: {schema: SuggestExplorationTopicsOutputSchema},
  prompt: `Suggest 5 related topics for further exploration of Hindu mythology based on the current topic.

Current Topic: {{{topic}}}

Suggested Topics:`,
});

const suggestExplorationTopicsFlow = ai.defineFlow(
  {
    name: 'suggestExplorationTopicsFlow',
    inputSchema: SuggestExplorationTopicsInputSchema,
    outputSchema: SuggestExplorationTopicsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output;
  }
);
