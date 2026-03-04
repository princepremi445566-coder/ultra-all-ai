'use server';
/**
 * @fileOverview A Genkit flow for generating engaging Instagram captions based on user input.
 *
 * - generateInstagramCaption - A function that generates an Instagram caption.
 * - GenerateInstagramCaptionInput - The input type for the generateInstagramCaption function.
 * - GenerateInstagramCaptionOutput - The return type for the generateInstagramCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInstagramCaptionInputSchema = z.object({
  description: z
    .string()
    .describe('A brief description of the Instagram post, e.g., "eating ice cream at the beach".'),
  tone: z
    .string()
    .describe('The desired tone for the caption (e.g., funny, serious, inspiring, casual, professional).'),
  keywords: z
    .array(z.string())
    .optional()
    .describe('Optional keywords to include in the caption.'),
});
export type GenerateInstagramCaptionInput = z.infer<typeof GenerateInstagramCaptionInputSchema>;

const GenerateInstagramCaptionOutputSchema = z.object({
  caption: z.string().describe('The generated Instagram caption.'),
  hashtags: z
    .array(z.string())
    .describe('A list of relevant hashtags for the caption.'),
});
export type GenerateInstagramCaptionOutput = z.infer<typeof GenerateInstagramCaptionOutputSchema>;

export async function generateInstagramCaption(
  input: GenerateInstagramCaptionInput
): Promise<GenerateInstagramCaptionOutput> {
  return generateInstagramCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInstagramCaptionPrompt',
  input: {schema: GenerateInstagramCaptionInputSchema},
  output: {schema: GenerateInstagramCaptionOutputSchema},
  prompt: `You are an expert social media manager tasked with creating compelling Instagram captions.

Generate an engaging Instagram caption and a list of relevant hashtags based on the following information:

Post Description: {{{description}}}
Desired Tone: {{{tone}}}

{{#if keywords}}
Keywords to include: {{#each keywords}}- {{{this}}}{{/each}}
{{/if}}

Ensure the caption matches the desired tone and incorporates any provided keywords naturally. The caption should be suitable for an Instagram post.
`,
});

const generateInstagramCaptionFlow = ai.defineFlow(
  {
    name: 'generateInstagramCaptionFlow',
    inputSchema: GenerateInstagramCaptionInputSchema,
    outputSchema: GenerateInstagramCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
