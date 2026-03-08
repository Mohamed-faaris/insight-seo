import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HeadingAnalysis } from "@/lib/seo-types";
import { Heading } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface HeadingChartProps {
  headings: HeadingAnalysis;
}

const COLORS = [
  "hsl(199, 89%, 48%)",
  "hsl(152, 69%, 41%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(262, 83%, 58%)",
  "hsl(215, 20%, 55%)",
];

export function HeadingChart({ headings }: HeadingChartProps) {
  const data = [
    { name: "H1", count: headings.h1.length },
    { name: "H2", count: headings.h2.length },
    { name: "H3", count: headings.h3.length },
    { name: "H4", count: headings.h4.length },
    { name: "H5", count: headings.h5.length },
    { name: "H6", count: headings.h6.length },
  ];

  const allHeadings = [
    ...headings.h1.map((t) => ({ level: "H1", text: t })),
    ...headings.h2.map((t) => ({ level: "H2", text: t })),
    ...headings.h3.map((t) => ({ level: "H3", text: t })),
    ...headings.h4.map((t) => ({ level: "H4", text: t })),
    ...headings.h5.map((t) => ({ level: "H5", text: t })),
    ...headings.h6.map((t) => ({ level: "H6", text: t })),
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Heading className="h-4 w-4 text-primary" />
          Heading Structure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {allHeadings.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-1">
            {allHeadings.slice(0, 20).map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="font-mono font-semibold text-primary shrink-0 w-6">{h.level}</span>
                <span className="text-muted-foreground truncate">{h.text}</span>
              </div>
            ))}
            {allHeadings.length > 20 && (
              <p className="text-xs text-muted-foreground">...and {allHeadings.length - 20} more</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
