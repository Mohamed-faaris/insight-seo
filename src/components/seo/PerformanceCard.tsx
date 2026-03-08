import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PerformanceData } from "@/lib/seo-types";
import { Gauge } from "lucide-react";

interface PerformanceCardProps {
  performance: PerformanceData | null;
}

export function PerformanceCard({ performance }: PerformanceCardProps) {
  if (!performance) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-4 w-4 text-primary" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24 rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">PageSpeed API key not configured</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    { label: "FCP", value: `${(performance.fcp / 1000).toFixed(1)}s`, good: performance.fcp < 1800 },
    { label: "LCP", value: `${(performance.lcp / 1000).toFixed(1)}s`, good: performance.lcp < 2500 },
    { label: "CLS", value: performance.cls.toFixed(3), good: performance.cls < 0.1 },
    { label: "TBT", value: `${Math.round(performance.tbt)}ms`, good: performance.tbt < 200 },
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-4 w-4 text-primary" />
          Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 rounded-lg" style={{
          background: performance.score >= 90 ? "hsl(var(--success) / 0.1)" : performance.score >= 50 ? "hsl(var(--warning) / 0.1)" : "hsl(var(--destructive) / 0.1)",
        }}>
          <p className="text-4xl font-bold" style={{
            color: performance.score >= 90 ? "hsl(var(--success))" : performance.score >= 50 ? "hsl(var(--warning))" : "hsl(var(--destructive))",
          }}>
            {performance.score}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Performance Score</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {metrics.map((m) => (
            <div key={m.label} className="p-2 rounded-lg bg-secondary/50 text-center">
              <p className="text-lg font-semibold" style={{ color: m.good ? "hsl(var(--success))" : "hsl(var(--warning))" }}>
                {m.value}
              </p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
