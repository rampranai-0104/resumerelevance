'use server';

export type RelevanceResult = {
  name: string;
  score: number;
  explanation: string;
  matchedSkills: string[];
  missingSkills: string[];
  details: {
    skills: { matched: string[]; missing: string[] };
    experience: string;
    education: string;
    semanticSimilarity: number;
  };
};

const MOCK_SKILLS = [
  'React',
  'Node.js',
  'TypeScript',
  'Python',
  'AWS',
  'Docker',
  'Kubernetes',
  'SQL',
  'NoSQL',
  'CI/CD',
  'GraphQL',
  'Tailwind CSS',
];

const generateMockResult = (fileName: string, index: number): RelevanceResult => {
  const score = Math.floor(Math.random() * (98 - 65 + 1) + 65);
  const matchedCount = Math.floor(MOCK_SKILLS.length * (score / 100));
  const shuffledSkills = MOCK_SKILLS.sort(() => 0.5 - Math.random());

  const matchedSkills = shuffledSkills.slice(0, matchedCount);
  const missingSkills = shuffledSkills.slice(matchedCount, matchedCount + 2);

  let explanation = '';
  if (score > 85) {
    explanation = `Excellent fit. The candidate shows strong alignment with required skills like ${matchedSkills[0]} and ${matchedSkills[1]}, and has relevant project experience.`;
  } else if (score > 75) {
    explanation = `Good candidate. Matches several key skills such as ${matchedSkills[0]}, though lacks experience in ${missingSkills[0]}. Worth considering for an interview.`;
  } else {
    explanation = `Moderate fit. While the candidate has some relevant skills, there are significant gaps in areas like ${missingSkills[0]} and ${missingSkills[1]}.`;
  }
  
  const experienceYears = Math.floor(Math.random() * 5) + 3;
  const requiredExp = 5;

  return {
    name: fileName,
    score: score,
    explanation: explanation,
    matchedSkills: matchedSkills,
    missingSkills: missingSkills,
    details: {
      skills: {
        matched: matchedSkills,
        missing: missingSkills,
      },
      experience: `Candidate has ${experienceYears} years of experience. Job requires ${requiredExp}+ years.`,
      education: 'Bachelor of Science in Computer Science. Meets requirements.',
      semanticSimilarity: Math.random() * (0.9 - 0.7) + 0.7,
    },
  };
};

export async function checkRelevance(
  jobDescription: string,
  resumeCount: number,
  fileNames: string[]
): Promise<RelevanceResult[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (!jobDescription || jobDescription.length < 50) {
    throw new Error('Please provide a job description of at least 50 characters.');
  }
  if (resumeCount === 0) {
    throw new Error('No resumes were provided for analysis.');
  }

  // Return mock data
  const results = Array.from({ length: resumeCount }).map((_, i) =>
    generateMockResult(fileNames[i] || `resume_${i + 1}.pdf`, i)
  );

  return results;
}
