import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContentAnalysis } from "@/lib/seo-types";
import { FileText } from "lucide-react";

interface ContentCardProps {
  content: ContentAnalysis;
}

export function ContentCard({ content }: ContentCardProps) {
  const topKeywords = Object.entries(content.keywordFrequency).slice(0, 10);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-primary" />
          Content Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold">{content.wordCount}</p>
            <p className="text-xs text-muted-foreground">Words</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold">{content.readabilityScore}</p>
            <p className="text-xs text-muted-foreground">Readability</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-lg font-bold">{content.readabilityGrade}</p>
            <p className="text-xs text-muted-foreground">Grade</p>
          </div>
        </div>

        {topKeywords.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Top Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {topKeywords.map(([word, count]) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                >
                  {word}
                  <span className="font-semibold">{count}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
