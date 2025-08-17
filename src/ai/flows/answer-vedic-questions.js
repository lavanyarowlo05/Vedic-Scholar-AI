'use server';
/**
 * @fileOverview This file defines a Genkit flow for answering questions about Vedic texts.
 *
 * - answerVedicQuestion - The function to call to answer questions.
 * - AnswerVedicQuestionInput - The input type for the answerVedicQuestion function.
 * - AnswerVedicQuestionOutput - The output type for the answerVedicQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerVedicQuestionInputSchema = z.object({
  question: z.string().describe('The question to answer about Hindu mythology.'),
  relevantText: z.enum(['Mahabharata', 'Ramayana', 'Vedas', 'Upanishads']).optional().describe('The specific text to filter answers from.'),
});


const AnswerVedicQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question, with citations.'),
  sources: z.array(z.string()).describe('The sources cited in the answer.'),
});


export async function answerVedicQuestion(input) {
  return answerVedicQuestionFlow(input);
}

const answerVedicQuestionPrompt = ai.definePrompt({
  name: 'answerVedicQuestionPrompt',
  input: {schema: AnswerVedicQuestionInputSchema},
  output: {schema: AnswerVedicQuestionOutputSchema},
  prompt: `You are a knowledgeable scholar of Hindu mythology and Vedic texts.

  Answer the following question, citing relevant sources. If the user has specified a relevant text, only use that text as a source.

  Question: {{{question}}}
  Relevant Text: {{relevantText}}

  Format your answer as a well-structured paragraph with clear citations.
  Sources should be listed at the end of the answer. If relevantText is provided, you MUST cite sources from that text only.
`,
});

const answerVedicQuestionFlow = ai.defineFlow(
  {
    name: 'answerVedicQuestionFlow',
    inputSchema: AnswerVedicQuestionInputSchema,
    outputSchema: AnswerVedicQuestionOutputSchema,
  },
  async input => {
    const {output} = await answerVedicQuestionPrompt(input);
    return output;
  }
);
