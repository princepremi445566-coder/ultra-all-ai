'use server';
/**
 * @fileOverview A Genkit flow for generating catchy and SEO-friendly YouTube video titles.
 *
 * - generateYoutubeTitle - A function that handles the YouTube title generation process.
 * - GenerateYoutubeTitleInput - The input type for the generateYoutubeTitle function.
 * - GenerateYoutubeTitleOutput - The return type for the generateYoutubeTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateYoutubeTitleInputSchema = z.object({
  videoDescription: z
    .string()
    .describe('A detailed description of the YouTube video content.'),
  keywords: z
    .string()
    .describe('Comma-separated keywords relevant to the video content.'),
  targetAudience: z
    .string()
    .optional()
    .describe(
      'An optional description of the target audience for the video. (e.g., "tech enthusiasts", "young parents")'
    ),
});
export type GenerateYoutubeTitleInput = z.infer<
  typeof GenerateYoutubeTitleInputSchema
>;

const GenerateYoutubeTitleOutputSchema = z.object({
  titles: z
    .array(z.string())
    .describe('An array of generated, catchy, and SEO-friendly YouTube titles.'),
});
export type GenerateYoutubeTitleOutput = z.infer<
  typeof GenerateYoutubeTitleOutputSchema
>;

export async function generateYoutubeTitle(
  input: GenerateYoutubeTitleInput
): Promise<GenerateYoutubeTitleOutput> {
  return generateYoutubeTitleFlow(input);
}

const generateYoutubeTitlePrompt = ai.definePrompt({
  name: 'generateYoutubeTitlePrompt',
  input: {schema: GenerateYoutubeTitleInputSchema},
  output: {schema: GenerateYoutubeTitleOutputSchema},
  prompt: `You are an expert YouTube SEO and content strategist.
Your task is to generate 5 catchy, SEO-friendly YouTube video titles based on the provided information.
Ensure the titles are engaging and designed to attract viewers.

Video Description: {{{videoDescription}}}
Keywords: {{{keywords}}}
{{#if targetAudience}}Target Audience: {{{targetAudience}}}{{/if}}

Provide the 5 titles as a JSON array in the specified output schema.
`,
});

const generateYoutubeTitleFlow = ai.defineFlow(
  {
    name: 'generateYoutubeTitleFlow',
    inputSchema: GenerateYoutubeTitleInputSchema,
    outputSchema: GenerateYoutubeTitleOutputSchema,
  },
  async input => {
    const {output} = await generateYoutubeTitlePrompt(input);
    return output!;
  }
);
