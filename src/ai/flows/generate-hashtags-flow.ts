'use server';
/**
 * @fileOverview A Genkit flow for generating relevant and trending hashtags for social media posts.
 *
 * - generateHashtags - A function that handles the hashtag generation process.
 * - HashtagGeneratorInput - The input type for the generateHashtags function.
 * - HashtagGeneratorOutput - The return type for the generateHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HashtagGeneratorInputSchema = z.object({
  postContent: z
    .string()
    .describe('The main text content of the social media post.'),
  keywords: z
    .array(z.string())
    .optional()
    .describe('Optional keywords to guide the hashtag generation.'),
  tone: z
    .string()
    .optional()
    .describe('Optional tone for the hashtags (e.g., funny, professional, inspiring).'),
  numHashtags: z
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .describe('The desired number of hashtags to generate (between 1 and 20).'),
});
export type HashtagGeneratorInput = z.infer<typeof HashtagGeneratorInputSchema>;

const HashtagGeneratorOutputSchema = z.object({
  hashtags: z
    .array(z.string())
    .describe('An array of generated relevant and trending hashtags.'),
});
export type HashtagGeneratorOutput = z.infer<typeof HashtagGeneratorOutputSchema>;

export async function generateHashtags(
  input: HashtagGeneratorInput
): Promise<HashtagGeneratorOutput> {
  return generateHashtagsFlow(input);
}

const generateHashtagsPrompt = ai.definePrompt({
  name: 'generateHashtagsPrompt',
  input: {schema: HashtagGeneratorInputSchema},
  output: {schema: HashtagGeneratorOutputSchema},
  prompt: `You are an expert social media manager specialized in Instagram and other platforms.
Your task is to generate a list of relevant and trending hashtags based on the provided post content and other optional parameters.

Consider the following post content:
Content: {{{postContent}}}

{{#if keywords}}
Also consider these keywords to guide the generation: {{{keywords}}}
{{/if}}

{{#if tone}}
Ensure the hashtags align with this tone: {{{tone}}}
{{/if}}

Generate exactly {{numHashtags}} hashtags. Each hashtag must start with '#'.
Avoid generic hashtags like '#love', '#happy', unless specifically requested.
Focus on niche, trending, and relevant hashtags that will maximize visibility and reach.

The output must be a JSON object containing a single field 'hashtags', which is an array of strings. Do not include any other text.
Example: {"hashtags": ["#travelgram", "#wanderlust", "#explore", "#adventuretime"]}`,
});

const generateHashtagsFlow = ai.defineFlow(
  {
    name: 'generateHashtagsFlow',
    inputSchema: HashtagGeneratorInputSchema,
    outputSchema: HashtagGeneratorOutputSchema,
  },
  async (input) => {
    // Provide a default for numHashtags if not specified in the input
    const numHashtags = input.numHashtags || 10;
    const promptInput = {...input, numHashtags};

    const {output} = await generateHashtagsPrompt(promptInput);
    return output!;
  }
);
