import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TechnicalSeo, SecurityAnalysis, StructuredDataAnalysis } from "@/lib/seo-types";
import { Settings, Lock, Code2, Check, X } from "lucide-react";

interface TechnicalCardProps {
  technical: TechnicalSeo;
  security: SecurityAnalysis;
  structuredData: StructuredDataAnalysis;
}

export function TechnicalCard({ technical, security, structuredData }: TechnicalCardProps) {
  const checks = [
    { label: "HTTPS", ok: security.isHttps },
    { label: "robots.txt", ok: technical.hasRobotsTxt },
    { label: "sitemap.xml", ok: technical.hasSitemap },
    { label: "Canonical URL", ok: !!technical.canonicalUrl && !technical.hasCanonicalConflict },
    { label: "No Mixed Content", ok: !security.hasMixedContent },
    { label: "Indexable", ok: !technical.hasNoindex },
    { label: "Structured Data", ok: structuredData.hasStructuredData },
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings className="h-4 w-4 text-primary" />
          Technical & Security
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {checks.map((check) => (
            <div key={check.label} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <span className="text-sm">{check.label}</span>
              {check.ok ? (
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-xs text-success font-medium">Pass</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <X className="h-4 w-4 text-destructive" />
                  <span className="text-xs text-destructive font-medium">Fail</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {structuredData.schemaTypes.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Schema Types</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {structuredData.schemaTypes.map((type) => (
                <span key={type} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono">
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
