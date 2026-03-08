import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PageInfo, FaviconData } from "@/lib/seo-types";
import { Globe, Clock, ArrowRight, Star, Check, X } from "lucide-react";

interface PageInfoCardProps {
  info: PageInfo;
  favicon?: FaviconData;
  siteUrl: string;
}

export function PageInfoCard({ info, favicon, siteUrl }: PageInfoCardProps) {
  const statusColor = info.statusCode === 200 ? "success" : info.statusCode >= 400 ? "destructive" : "warning";

  const faviconUrl = favicon?.url
    ? favicon.url.startsWith("http") ? favicon.url : new URL(favicon.url, siteUrl).toString()
    : "";
  const appleTouchUrl = favicon?.appleTouchIcon
    ? favicon.appleTouchIcon.startsWith("http") ? favicon.appleTouchIcon : new URL(favicon.appleTouchIcon, siteUrl).toString()
    : "";

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="h-4 w-4 text-primary" />
          Page Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge variant={statusColor === "success" ? "default" : "destructive"} className="mt-1">
              {info.statusCode}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Load Time</p>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold">{(info.loadTime / 1000).toFixed(2)}s</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Content Size</p>
            <span className="text-sm font-semibold">{(info.contentLength / 1024).toFixed(1)} KB</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Redirects</p>
            <span className="text-sm font-semibold">{info.redirectChain.length - 1}</span>
          </div>
        </div>

        {info.redirectChain.length > 1 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Redirect Chain</p>
            <div className="space-y-1">
              {info.redirectChain.map((u, i) => (
                <div key={i} className="flex items-center gap-1 text-xs">
                  {i > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                  <span className="truncate text-muted-foreground">{u}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favicon Section */}
        {favicon && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Favicon</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Favicon Previews */}
              <div className="flex gap-2 items-end">
                {faviconUrl ? (
                  <>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded bg-secondary/50 flex items-center justify-center overflow-hidden border border-border">
                        <img src={faviconUrl} alt="Favicon" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">16px</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded bg-secondary/50 flex items-center justify-center overflow-hidden border border-border">
                        <img src={faviconUrl} alt="Favicon" className="w-8 h-8" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">32px</span>
                    </div>
                    {appleTouchUrl && (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden border border-border">
                          <img src={appleTouchUrl} alt="Apple Touch" className="w-10 h-10 rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">Apple</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-10 h-10 rounded border border-dashed border-border flex items-center justify-center">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Checks */}
              <div className="flex-1 space-y-1.5">
                {[
                  { label: "Favicon", ok: favicon.found },
                  { label: "Apple Touch Icon", ok: !!favicon.appleTouchIcon },
                  { label: "Sizes defined", ok: !!favicon.sizes },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-1.5">
                    {c.ok ? <Check className="h-3 w-3 text-success" /> : <X className="h-3 w-3 text-destructive" />}
                    <span className="text-[11px] text-muted-foreground">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
