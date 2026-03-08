import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ManifestData } from "@/lib/seo-types";
import { FileJson, Check, X, Palette } from "lucide-react";

interface ManifestCardProps {
  manifest: ManifestData;
  siteUrl: string;
}

export function ManifestCard({ manifest, siteUrl }: ManifestCardProps) {
  const properties = [
    { label: "Name", value: manifest.name },
    { label: "Short Name", value: manifest.shortName },
    { label: "Start URL", value: manifest.startUrl },
    { label: "Display", value: manifest.display },
    { label: "Theme Color", value: manifest.themeColor },
    { label: "Background", value: manifest.backgroundColor },
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileJson className="h-4 w-4 text-primary" />
          Web App Manifest
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!manifest.found ? (
          <div className="flex items-center justify-center h-24 rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">No manifest.json found</p>
          </div>
        ) : (
          <>
            {/* Properties */}
            <div className="space-y-2">
              {properties.map((p) => (
                <div key={p.label} className="flex items-center gap-2 text-xs">
                  {p.value ? (
                    <Check className="h-3 w-3 text-success shrink-0" />
                  ) : (
                    <X className="h-3 w-3 text-muted-foreground shrink-0" />
                  )}
                  <span className="text-muted-foreground w-24 shrink-0">{p.label}</span>
                  {p.label === "Theme Color" && p.value ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: p.value }} />
                      <span className="font-mono text-foreground">{p.value}</span>
                    </div>
                  ) : p.label === "Background" && p.value ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: p.value }} />
                      <span className="font-mono text-foreground">{p.value}</span>
                    </div>
                  ) : (
                    <span className="truncate text-foreground font-mono">{p.value || "—"}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Icons */}
            {manifest.icons.length > 0 && (
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="h-3.5 w-3.5 text-primary" />
                  <p className="text-xs font-medium text-muted-foreground">
                    Icons ({manifest.icons.length})
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {manifest.icons.slice(0, 6).map((icon, i) => {
                    const iconUrl = icon.src.startsWith("http")
                      ? icon.src
                      : new URL(icon.src, siteUrl).toString();
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded bg-secondary/50 flex items-center justify-center overflow-hidden border border-border">
                          <img
                            src={iconUrl}
                            alt={icon.sizes}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{icon.sizes || "?"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Issues */}
            {manifest.issues.length > 0 && (
              <div className="pt-2 border-t border-border space-y-1">
                {manifest.issues.map((issue, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    {issue.severity === "pass" ? (
                      <Check className="h-3 w-3 text-success shrink-0" />
                    ) : (
                      <X className="h-3 w-3 text-destructive shrink-0" />
                    )}
                    <span className="text-muted-foreground">{issue.message}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
