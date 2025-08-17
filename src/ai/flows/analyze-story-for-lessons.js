'use server';

/**
 * @fileOverview A flow to analyze a mythological story for life lessons and contemporary relevance.
 *
 * - analyzeStoryForLessons - A function that analyzes a story.
 * - AnalyzeStoryForLessonsInput - The input type for the analyzeStoryForLessons function.
 * - AnalyzeStoryForLessonsOutput - The return type for the analyzeStoryForLessons function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStoryForLessonsInputSchema = z.object({
  story: z.string().describe('The mythological story to analyze.'),
  question: z.string().describe('The original question that led to this story.'),
});


const AnalyzeStoryForLessonsOutputSchema = z.object({
  analysis: z.string().describe('A comprehensive analysis of the life lessons from the story.'),
  relevance: z.string().describe('An explanation of the story\'s relevance in contemporary life.'),
});


export async function analyzeStoryForLessons(
  input
) {
  return analyzeStoryForLessonsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStoryForLessonsPrompt',
  input: {schema: AnalyzeStoryForLessonsInputSchema},
  output: {schema: AnalyzeStoryForLessonsOutputSchema},
  prompt: `You are a mythological analyst and philosopher.
The user asked the following question: "{{question}}"
And received this story as an answer: "{{story}}"

Provide a comprehensive analysis of the life lessons derived from this story.
Explain the moral teachings and values imparted.
Highlight the relevance and application of these lessons in contemporary life.
Offer insights into the universal principles and ethics the story embodies.

Structure your response into two parts:
1.  **Analysis**: A detailed breakdown of the moral teachings and universal principles.
2.  **Contemporary Relevance**: How these lessons apply to modern life, challenges, and personal growth.
`,
});

const analyzeStoryForLessonsFlow = ai.defineFlow(
  {
    name: 'analyzeStoryForLessonsFlow',
    inputSchema: AnalyzeStoryForLessonsInputSchema,
    outputSchema: AnalyzeStoryForLessonsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output;
  }
);
