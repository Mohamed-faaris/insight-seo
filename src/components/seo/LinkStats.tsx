import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LinkAnalysis } from "@/lib/seo-types";
import { Link2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface LinkStatsProps {
  links: LinkAnalysis;
}

export function LinkStats({ links }: LinkStatsProps) {
  const data = [
    { name: "Internal", value: links.internal, color: "hsl(var(--chart-1))" },
    { name: "External", value: links.external, color: "hsl(var(--chart-5))" },
    { name: "Nofollow", value: links.nofollow, color: "hsl(var(--chart-3))" },
  ].filter((d) => d.value > 0);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Link2 className="h-4 w-4 text-primary" />
          Link Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="h-32 w-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%" cy="50%"
                  innerRadius={30} outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(199, 89%, 48%)" }} />
                <span className="text-sm text-muted-foreground">Internal</span>
              </div>
              <span className="text-sm font-semibold">{links.internal}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(262, 83%, 58%)" }} />
                <span className="text-sm text-muted-foreground">External</span>
              </div>
              <span className="text-sm font-semibold">{links.external}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(38, 92%, 50%)" }} />
                <span className="text-sm text-muted-foreground">Nofollow</span>
              </div>
              <span className="text-sm font-semibold">{links.nofollow}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-sm font-medium">Total</span>
              <span className="text-sm font-bold">{links.total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
