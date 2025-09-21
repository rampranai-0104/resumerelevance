// src/ai/flows/extract-information.ts
'use server';
/**
 * @fileOverview A flow for extracting key information (skills, experience, and education) from resumes and job descriptions.
 *
 * - extractInformation - A function that handles the information extraction process.
 * - ExtractInformationInput - The input type for the extractInformation function.
 * - ExtractInformationOutput - The return type for the extractInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractInformationInputSchema = z.object({
  text: z.string().describe('The text content of the resume or job description.'),
  type: z.enum(['resume', 'job_description']).describe('The type of the text content.'),
});
export type ExtractInformationInput = z.infer<typeof ExtractInformationInputSchema>;

const ExtractInformationOutputSchema = z.object({
  skills: z.array(z.string()).describe('A list of skills extracted from the text.'),
  experience: z.string().describe('A summary of the experience extracted from the text.'),
  education: z.string().describe('A summary of the education extracted from the text.'),
});
export type ExtractInformationOutput = z.infer<typeof ExtractInformationOutputSchema>;

export async function extractInformation(input: ExtractInformationInput): Promise<ExtractInformationOutput> {
  return extractInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractInformationPrompt',
  input: {schema: ExtractInformationInputSchema},
  output: {schema: ExtractInformationOutputSchema},
  prompt: `You are an expert HR assistant. Your task is to extract key information from the given text, which can be either a resume or a job description.

  Extract skills, experience, and education from the following text:

  {{text}}

  Return the information in JSON format.
  If the text is a resume, focus on the candidate's skills, experience, and education.
  If the text is a job description, focus on the required skills, experience, and education.
  Make sure skills does not contain duplicates.
  `,
});

const extractInformationFlow = ai.defineFlow(
  {
    name: 'extractInformationFlow',
    inputSchema: ExtractInformationInputSchema,
    outputSchema: ExtractInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
