import { config } from 'dotenv';
config();

import '@/ai/flows/generate-explanation.ts';
import '@/ai/flows/relevance-scoring.ts';
import '@/ai/flows/extract-information.ts';