// src/ai/flows/generate-explanation.ts
'use server';
/**
 * @fileOverview Generates an explanation of how well a resume matches a job description.
 *
 * - generateExplanation - A function that generates the explanation.
 * - GenerateExplanationInput - The input type for the generateExplanation function.
 * - GenerateExplanationOutput - The return type for the generateExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExplanationInputSchema = z.object({
  resumeText: z.string().describe('The extracted text content of the resume.'),
  jobDescription: z.string().describe('The job description text.'),
  matchedSkills: z.array(z.string()).describe('Skills found in both the resume and job description.'),
  missingSkills: z.array(z.string()).describe('Skills listed in the job description but not found in the resume.'),
  experienceYearsResume: z.number().describe('Years of experience listed on the resume.'),
  experienceYearsJD: z.number().describe('Years of experience required in the job description.'),
  educationMatch: z.boolean().describe('Whether the education level on the resume matches the job description requirements.'),
});
export type GenerateExplanationInput = z.infer<typeof GenerateExplanationInputSchema>;

const GenerateExplanationOutputSchema = z.object({
  explanation: z.string().describe('A human-readable explanation of how well the resume fits the job description.'),
});
export type GenerateExplanationOutput = z.infer<typeof GenerateExplanationOutputSchema>;

export async function generateExplanation(input: GenerateExplanationInput): Promise<GenerateExplanationOutput> {
  return generateExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExplanationPrompt',
  input: {schema: GenerateExplanationInputSchema},
  output: {schema: GenerateExplanationOutputSchema},
  prompt: `You are an expert HR assistant whose job is to explain how well a candidate's resume matches a job description.\n\n  Here's the resume text: {{{resumeText}}}\n  Here's the job description: {{{jobDescription}}}\n\n  Here are the skills matched in the resume and job description: {{{matchedSkills}}}\n  Here are the skills missing from the resume, but present in the job description: {{{missingSkills}}}\n\n  The resume lists {{{experienceYearsResume}}} years of experience, while the job description requires {{{experienceYearsJD}}} years of experience.\n  The resume's education level {{{#if educationMatch}}matches the job description requirements.{{else}}does not match the job description requirements.{{/if}}\n\n  Generate a concise explanation (2-3 sentences) of why this resume is a good or bad fit, highlighting the matched and missing skills, experience gaps, and educational alignment.  Focus on the most important factors.\n  The explanation should be easy to understand for a non-technical HR professional.\n  `,
});

const generateExplanationFlow = ai.defineFlow(
  {
    name: 'generateExplanationFlow',
    inputSchema: GenerateExplanationInputSchema,
    outputSchema: GenerateExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
