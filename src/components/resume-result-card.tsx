import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CircularProgress } from '@/components/circular-progress';
import { type RelevanceResult } from '@/app/actions';
import { FileText, GraduationCap, Star, Target } from 'lucide-react';

interface ResumeResultCardProps {
  result: RelevanceResult;
}

export function ResumeResultCard({ result }: ResumeResultCardProps) {
  return (
    <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText className="h-6 w-6 shrink-0 text-muted-foreground" />
            <span className="truncate font-headline">{result.name}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center md:col-span-1">
          <CircularProgress value={result.score} />
          <p className="mt-2 text-center font-semibold text-muted-foreground">
            Overall Score
          </p>
        </div>
        <div className="space-y-4 md:col-span-2">
          <div>
            <h4 className="mb-2 font-semibold">AI Explanation</h4>
            <p className="text-sm text-muted-foreground">{result.explanation}</p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Matched Skills</h4>
            <div className="flex flex-wrap gap-2">
              {result.matchedSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                  {skill}
                </Badge>
              ))}
               {result.matchedSkills.length === 0 && <p className="text-sm text-muted-foreground">No matching skills found.</p>}
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Missing Skills</h4>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((skill) => (
                <Badge key={skill} variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20">
                  {skill}
                </Badge>
              ))}
              {result.missingSkills.length === 0 && <p className="text-sm text-muted-foreground">All required skills are present!</p>}
            </div>
          </div>
        </div>
      </CardContent>
      <Accordion type="single" collapsible className="w-full px-6 pb-4">
        <AccordionItem value="item-1">
          <AccordionTrigger>More Details</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <Star className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h5 className="font-semibold">Experience</h5>
                  <p className="text-sm text-muted-foreground">
                    {result.details.experience}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h5 className="font-semibold">Education</h5>
                  <p className="text-sm text-muted-foreground">
                    {result.details.education}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h5 className="font-semibold">Semantic Similarity</h5>
                  <p className="text-sm text-muted-foreground">
                    {(result.details.semanticSimilarity * 100).toFixed(1)}% match
                    with job description keywords.
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
