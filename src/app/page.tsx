'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/icons';
import { FileUploader } from '@/components/file-uploader';
import { ResumeResultCard } from '@/components/resume-result-card';
import { checkRelevance, RelevanceResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, FileText, SortAsc } from 'lucide-react';

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [results, setResults] = useState<RelevanceResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');
  const { toast } = useToast();

  const handleFileChange = (files: File[]) => {
    setResumeFiles(files);
    setError(null);
  };

  const handleSubmit = async () => {
    if (resumeFiles.length === 0) {
      setError('Please upload at least one resume.');
      toast({
        title: 'No resumes uploaded',
        description: 'You need to upload one or more resumes to check.',
        variant: 'destructive',
      });
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      toast({
        title: 'Job description is empty',
        description: 'Please paste the job description before checking.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const relevanceResults = await checkRelevance(
        jobDescription,
        resumeFiles.length,
        resumeFiles.map((f) => f.name)
      );
      setResults(relevanceResults);
    } catch (e: any) {
      const errorMessage = e.message || 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        title: 'Analysis Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedResults = results
    ? [...results].sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return b.score - a.score;
      })
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <Logo />
        <h1 className="text-xl font-bold font-headline tracking-tight">
          <span className="text-gradient">ResumeRank</span> AI
        </h1>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-6 lg:sticky lg:top-20">
            <div className="space-y-2">
              <h2 className="font-headline text-2xl font-bold">1. Upload Resumes</h2>
              <p className="text-muted-foreground">
                Drag & drop or click to upload resumes (PDF, DOCX).
              </p>
            </div>
            <FileUploader
              onFilesChange={handleFileChange}
              acceptedMimeTypes={{
                'application/pdf': ['.pdf'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                  ['.docx'],
              }}
            />

            <div className="space-y-2">
              <h2 className="font-headline text-2xl font-bold">2. Paste Job Description</h2>
              <p className="text-muted-foreground">
                Enter the full job description below for analysis.
              </p>
            </div>
            <Textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setError(null);
              }}
              placeholder="Paste the job description here..."
              className="min-h-[200px] text-base"
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              size="lg"
              className="w-full font-bold"
            >
              {isLoading ? 'Analyzing...' : 'Check Relevance'}
            </Button>
            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="font-headline text-2xl font-bold">Results</h2>
              {results && (
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as 'score' | 'name')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score">Sort by Score</SelectItem>
                      <SelectItem value="name">Sort by Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
                ))}

              {!isLoading && !results && !error && (
                <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card/50 p-8 text-center">
                  <Bot className="h-16 w-16 text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-bold font-headline">
                    Awaiting Analysis
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Your resume analysis results will appear here.
                  </p>
                </div>
              )}

              {sortedResults &&
                sortedResults.map((result) => (
                  <ResumeResultCard key={result.name} result={result} />
                ))}

              {!isLoading && error && (
                <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-card/50 p-8 text-center">
                  <FileText className="h-16 w-16 text-destructive" />
                  <h3 className="mt-4 text-xl font-bold font-headline text-destructive">
                    Analysis Error
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Something went wrong. Please try again or adjust your inputs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
