'use server';
/**
 * @fileOverview A Genkit flow for generating creative and engaging Instagram bios.
 *
 * - generateInstagramBio - A function that handles the Instagram bio generation process.
 * - InstagramBioInput - The input type for the generateInstagramBio function.
 * - InstagramBioOutput - The return type for the generateInstagramBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InstagramBioInputSchema = z.object({
  keywords: z.string().describe('Keywords to include in the Instagram bio.'),
  tone: z.string().describe('Desired tone for the Instagram bio (e.g., witty, professional, inspiring).'),
  context: z.string().optional().describe('Additional context or information about the user/profile.'),
});
export type InstagramBioInput = z.infer<typeof InstagramBioInputSchema>;

const InstagramBioOutputSchema = z.object({
  bio: z.string().describe('The generated Instagram bio.'),
});
export type InstagramBioOutput = z.infer<typeof InstagramBioOutputSchema>;

const generateInstagramBioPrompt = ai.definePrompt({
  name: 'generateInstagramBioPrompt',
  input: {schema: InstagramBioInputSchema},
  output: {schema: InstagramBioOutputSchema},
  prompt: `You are an expert Instagram bio generator. Your task is to create a compelling and engaging Instagram bio based on the provided keywords, desired tone, and optional context.

Consider the following information:
Keywords: {{{keywords}}}
Tone: {{{tone}}}
{{#if context}}Context: {{{context}}}{{/if}}

Generate a creative and concise Instagram bio that captures the essence of the user's profile, uses relevant emojis, and fits within Instagram's character limit. Ensure the tone is consistent with the request.
`,
});

const generateInstagramBioFlow = ai.defineFlow(
  {
    name: 'generateInstagramBioFlow',
    inputSchema: InstagramBioInputSchema,
    outputSchema: InstagramBioOutputSchema,
  },
  async (input) => {
    const {output} = await generateInstagramBioPrompt(input);
    return output!;
  }
);

export async function generateInstagramBio(
  input: InstagramBioInput
): Promise<InstagramBioOutput> {
  return generateInstagramBioFlow(input);
}
