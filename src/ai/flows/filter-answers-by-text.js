'use server';

/**
 * @fileOverview Filters AI-generated answers based on specific texts.
 *
 * - filterAnswersByText - A function that filters answers based on the selected text.
 * - FilterAnswersByTextInput - The input type for the filterAnswersByText function.
 * - FilterAnswersByTextOutput - The return type for the filterAnswersByText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterAnswersByTextInputSchema = z.object({
  question: z.string().describe('The user question.'),
  selectedText: z
    .string()
    .describe('The specific text to filter answers by (e.g., Mahabharata, Ramayana).'),
});



const FilterAnswersByTextOutputSchema = z.object({
  filteredAnswer: z.string().describe('The AI-generated answer filtered by the selected text.'),
});


export async function filterAnswersByText(input) {
  return filterAnswersByTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterAnswersByTextPrompt',
  input: {schema: FilterAnswersByTextInputSchema},
  output: {schema: FilterAnswersByTextOutputSchema},
  prompt: `You are an AI assistant specialized in Hindu mythology and holy books.
  Your task is to answer the user's question, but you MUST filter the answer based on the specific text provided.
  Cite the source text in your answer.

  User Question: {{{question}}}
  Selected Text: {{{selectedText}}}

  Filtered Answer:`, // Asking the LLM to filter the answer based on selectedText.
});

const filterAnswersByTextFlow = ai.defineFlow(
  {
    name: 'filterAnswersByTextFlow',
    inputSchema: FilterAnswersByTextInputSchema,
    outputSchema: FilterAnswersByTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {filteredAnswer: output.filteredAnswer};
  }
);
