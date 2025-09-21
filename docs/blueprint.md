# **App Name**: ResumeRank AI

## Core Features:

- Resume Upload & Extraction: Allows users to upload multiple resumes (PDF, DOCX). Extracts and preprocesses text from resumes using unstructured. Employ optical character recognition as a tool when necessary.
- Job Description Input: Provides a text area for HR to paste job descriptions (JD).
- Intelligent Information Extraction: Extracts key information (skills, experience, education) from resumes and JDs using LangChain with a structured output parser.
- Relevance Scoring System: Calculates a hybrid relevance score (0-100) based on skills, experience, education match, and semantic similarity. Weights the must-have skill matching higher.
- AI-Powered Explanation: Generates a short, human-readable explanation highlighting matched and missing skills, experience gaps, and educational alignment, using an LLM tool.
- Ranked Results Display: Presents a ranked list of resumes based on relevance scores, displaying key metrics (score, matched/missing skills, explanation) within an interactive card component.
- Interactive UI Elements: Sort the resumes by score and show an animated progress bar illustrating the scores.

## Style Guidelines:

- Background color: Dark, desaturated slate gray (#232931) to support the dark theme.
- Primary color: Vibrant teal (#2AD6A3) to highlight key interactive elements. Note: 'teal' was not suggested directly.
- Accent color: A softer blue-green (#52D699), analogous to teal, providing a less intense but complementary highlight.
- Body text: 'Inter' sans-serif for a clean, modern, and readable interface.
- Headline font: 'Space Grotesk' sans-serif for headers, titles and short call-outs. A good pairing with Inter, while also fulfilling a more stylized look.
- Use Lottie animations and custom icons for visual appeal.
- Employ smooth transitions and hover effects using framer-motion.