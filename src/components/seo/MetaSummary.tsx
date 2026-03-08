import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MetaTagAnalysis } from "@/lib/seo-types";
import { FileText, Check, X, AlertTriangle } from "lucide-react";

interface MetaSummaryProps {
  meta: MetaTagAnalysis;
}

export function MetaSummary({ meta }: MetaSummaryProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-primary" />
          Meta Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Title</span>
            <Badge variant={meta.titleLength > 0 && meta.titleLength <= 60 ? "default" : "destructive"} className="text-xs">
              {meta.titleLength} chars
            </Badge>
          </div>
          <p className="text-sm font-medium truncate">{meta.title || "—"}</p>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (meta.titleLength / 60) * 100)}%`,
                background: meta.titleLength > 0 && meta.titleLength <= 60 ? "hsl(var(--success))" : "hsl(var(--destructive))",
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Description</span>
            <Badge variant={meta.descriptionLength > 0 && meta.descriptionLength <= 160 ? "default" : "destructive"} className="text-xs">
              {meta.descriptionLength} chars
            </Badge>
          </div>
          <p className="text-sm font-medium line-clamp-2">{meta.description || "—"}</p>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (meta.descriptionLength / 160) * 100)}%`,
                background: meta.descriptionLength > 0 && meta.descriptionLength <= 160 ? "hsl(var(--success))" : "hsl(var(--destructive))",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {[
            { label: "Canonical", value: meta.canonical },
            { label: "Robots", value: meta.robots },
            { label: "Charset", value: meta.charset },
            { label: "Viewport", value: meta.viewport },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              {item.value ? (
                <Check className="h-3.5 w-3.5 text-success shrink-0" />
              ) : (
                <X className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              )}
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
