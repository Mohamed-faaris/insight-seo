import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FaviconData } from "@/lib/seo-types";
import { Star, Check, X } from "lucide-react";

interface FaviconCardProps {
  favicon: FaviconData;
  siteUrl: string;
}

export function FaviconCard({ favicon, siteUrl }: FaviconCardProps) {
  const faviconUrl = favicon.url
    ? favicon.url.startsWith("http") ? favicon.url : new URL(favicon.url, siteUrl).toString()
    : "";

  const appleTouchUrl = favicon.appleTouchIcon
    ? favicon.appleTouchIcon.startsWith("http") ? favicon.appleTouchIcon : new URL(favicon.appleTouchIcon, siteUrl).toString()
    : "";

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Star className="h-4 w-4 text-primary" />
          Favicon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {/* Preview */}
          <div className="flex gap-3 items-end">
            {faviconUrl ? (
              <>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded bg-secondary/50 flex items-center justify-center overflow-hidden border border-border">
                    <img src={faviconUrl} alt="Favicon 16" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">16px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded bg-secondary/50 flex items-center justify-center overflow-hidden border border-border">
                    <img src={faviconUrl} alt="Favicon 32" className="w-8 h-8" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">32px</span>
                </div>
                {appleTouchUrl && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden border border-border">
                      <img src={appleTouchUrl} alt="Apple Touch" className="w-12 h-12 rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">Apple</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center w-16 h-16 rounded-lg border border-dashed border-border">
                <X className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            {[
              { label: "Favicon found", ok: favicon.found },
              { label: "Apple Touch Icon", ok: !!favicon.appleTouchIcon },
              { label: "Has sizes", ok: !!favicon.sizes },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-2">
                {c.ok ? <Check className="h-3.5 w-3.5 text-success" /> : <X className="h-3.5 w-3.5 text-destructive" />}
                <span className="text-xs text-muted-foreground">{c.label}</span>
              </div>
            ))}
            {favicon.type && (
              <p className="text-xs text-muted-foreground">Type: <span className="font-mono text-foreground">{favicon.type}</span></p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
