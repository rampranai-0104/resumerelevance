'use server';

/**
 * @fileOverview Calculates a relevance score for each resume based on the job description.
 *
 * - calculateRelevanceScore - A function that calculates the relevance score.
 * - CalculateRelevanceScoreInput - The input type for the calculateRelevanceScore function.
 * - CalculateRelevanceScoreOutput - The return type for the calculateRelevanceScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateRelevanceScoreInputSchema = z.object({
  resumeText: z.string().describe('The extracted text content of the resume.'),
  jobDescription: z.string().describe('The job description provided by the HR professional.'),
  mustHaveSkills: z.array(z.string()).describe('List of must-have skills extracted from the job description.'),
  niceToHaveSkills: z.array(z.string()).describe('List of nice-to-have skills extracted from the job description.'),
  minExperience: z.number().describe('Minimum years of experience required for the job.'),
  educationRequirements: z.string().describe('Education requirements for the job.'),
});
export type CalculateRelevanceScoreInput = z.infer<typeof CalculateRelevanceScoreInputSchema>;

const CalculateRelevanceScoreOutputSchema = z.object({
  overallRelevanceScore: z.number().describe('The overall relevance score (0-100) of the resume to the job description.'),
  matchedSkills: z.array(z.string()).describe('List of skills from the resume that match the must-have and nice-to-have skills.'),
  missingSkills: z.array(z.string()).describe('List of must-have skills missing from the resume.'),
  explanation: z.string().describe('A short explanation of the relevance score, including matched/missing skills, experience, and education.'),
});
export type CalculateRelevanceScoreOutput = z.infer<typeof CalculateRelevanceScoreOutputSchema>;

export async function calculateRelevanceScore(input: CalculateRelevanceScoreInput): Promise<CalculateRelevanceScoreOutput> {
  return calculateRelevanceScoreFlow(input);
}

const calculateRelevanceScorePrompt = ai.definePrompt({
  name: 'calculateRelevanceScorePrompt',
  input: {schema: CalculateRelevanceScoreInputSchema},
  output: {schema: CalculateRelevanceScoreOutputSchema},
  prompt: `You are an AI assistant that evaluates resumes based on a job description and provides a relevance score.

  Resume Text: {{{resumeText}}}
  Job Description: {{{jobDescription}}}
  Must-Have Skills: {{#each mustHaveSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Nice-to-Have Skills: {{#each niceToHaveSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Minimum Experience: {{{minExperience}}} years
  Education Requirements: {{{educationRequirements}}}

  Analyze the resume and job description to determine the overall relevance score (0-100), considering skills, experience, and education.
  Identify matched and missing skills from the resume compared to the job description's must-have and nice-to-have skills.
  Generate a concise explanation of the relevance score, highlighting matched skills, missing skills, experience level compared to the minimum requirement, and education alignment.

  Provide the results in the following JSON format:
  {
    "overallRelevanceScore": number,
    "matchedSkills": string[],
    "missingSkills": string[],
    "explanation": string
  }`,
});

const calculateRelevanceScoreFlow = ai.defineFlow(
  {
    name: 'calculateRelevanceScoreFlow',
    inputSchema: CalculateRelevanceScoreInputSchema,
    outputSchema: CalculateRelevanceScoreOutputSchema,
  },
  async input => {
    const {output} = await calculateRelevanceScorePrompt(input);
    return output!;
  }
);
