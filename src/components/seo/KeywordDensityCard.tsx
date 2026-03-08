import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContentAnalysis } from "@/lib/seo-types";
import { Search } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface KeywordDensityCardProps {
  content: ContentAnalysis;
}

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(24, 95%, 53%)",
  "hsl(0, 72%, 51%)",
  "hsl(210, 100%, 56%)",
  "hsl(142, 71%, 45%)",
];

export function KeywordDensityCard({ content }: KeywordDensityCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const entries = Object.entries(content.keywordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 30);

  const totalWords = content.wordCount || 1;
  const chartData = entries.slice(0, 5).map(([word, count]) => ({
    word,
    count,
  }));

  if (entries.length === 0) return null;

  return (
    <Card className="glass-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4 text-primary" />
              Keyword Density
              <Badge variant="secondary" className="ml-1 text-xs">
                {entries.length}
              </Badge>
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                isOpen ? "" : "-rotate-90"
              }`}
            />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Bar Chart - Top 5 */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    type="category"
                    dataKey="word"
                    width={60}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [
                      `${value} (${((value / totalWords) * 100).toFixed(2)}%)`,
                      "Count",
                    ]}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-[1fr_80px_80px] gap-0 text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-2 border-b border-border">
                <span>Keyword</span>
                <span className="text-center">Count</span>
                <span className="text-right">Density</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {entries.map(([word, count]) => (
                  <div
                    key={word}
                    className="grid grid-cols-[1fr_80px_80px] gap-0 text-xs px-3 py-2 border-b border-border/50 last:border-b-0 hover:bg-secondary/30 transition-colors"
                  >
                    <span className="text-foreground">{word}</span>
                    <span className="text-center text-muted-foreground">{count}</span>
                    <span className="text-right text-muted-foreground">
                      {((count / totalWords) * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
