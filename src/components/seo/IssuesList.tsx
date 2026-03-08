import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SeoIssue } from "@/lib/seo-types";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Shield } from "lucide-react";

interface IssuesListProps {
  issues: SeoIssue[];
}

const severityConfig = {
  critical: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Critical" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Warning" },
  info: { icon: Info, color: "text-info", bg: "bg-info/10", label: "Info" },
  pass: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Pass" },
};

export function IssuesList({ issues }: IssuesListProps) {
  const critical = issues.filter((i) => i.severity === "critical");
  const warnings = issues.filter((i) => i.severity === "warning");
  const infos = issues.filter((i) => i.severity === "info");
  const passes = issues.filter((i) => i.severity === "pass");

  const sorted = [...critical, ...warnings, ...infos, ...passes];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-primary" />
            All Issues
          </div>
          <div className="flex gap-2">
            {critical.length > 0 && (
              <Badge variant="destructive" className="text-xs">{critical.length} Critical</Badge>
            )}
            {warnings.length > 0 && (
              <Badge className="bg-warning/20 text-warning border-warning/30 text-xs">{warnings.length} Warnings</Badge>
            )}
            <Badge className="bg-success/20 text-success border-success/30 text-xs">{passes.length} Passed</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sorted.map((issue, i) => {
            const config = severityConfig[issue.severity];
            const Icon = config.icon;
            return (
              <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg ${config.bg}`}>
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">{issue.category}</span>
                  </div>
                  <p className="text-sm">{issue.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
