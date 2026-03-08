import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FaviconData } from "@/lib/seo-types";
import { Globe, Check, X, Star } from "lucide-react";

interface GooglePreviewCardProps {
  url: string;
  title: string;
  description: string;
  favicon?: FaviconData;
  siteUrl?: string;
}

export function GooglePreviewCard({ url, title, description, favicon, siteUrl }: GooglePreviewCardProps) {
  let displayUrl = url;
  try {
    displayUrl = new URL(url).href;
  } catch {}

  const faviconUrl = favicon?.url
    ? favicon.url.startsWith("http") ? favicon.url : siteUrl ? new URL(favicon.url, siteUrl).toString() : favicon.url
    : "";
  const appleTouchUrl = favicon?.appleTouchIcon
    ? favicon.appleTouchIcon.startsWith("http") ? favicon.appleTouchIcon : siteUrl ? new URL(favicon.appleTouchIcon, siteUrl).toString() : favicon.appleTouchIcon
    : "";

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="h-4 w-4 text-primary" />
          Google Search Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google SERP Preview */}
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-1">
          <div className="flex items-center gap-2">
            {faviconUrl ? (
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border shrink-0">
                <img src={faviconUrl} alt="" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center border border-border shrink-0">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs text-foreground truncate">{tryHostname(url)}</p>
              <p className="text-[10px] text-muted-foreground truncate">{displayUrl}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-[hsl(210_100%_56%)] line-clamp-2 hover:underline cursor-pointer pt-1">
            {title || "No title found"}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description || "No meta description found"}
          </p>
        </div>

        {/* Favicon Checker */}
        {favicon && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Favicon Check</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2 items-end">
                {faviconUrl ? (
                  <>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded bg-secondary/50 flex items-center justify-center overflow-hidden border border-border">
                        <img src={faviconUrl} alt="16px" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">16px</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded bg-secondary/50 flex items-center justify-center overflow-hidden border border-border">
                        <img src={faviconUrl} alt="32px" className="w-8 h-8" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">32px</span>
                    </div>
                    {appleTouchUrl && (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden border border-border">
                          <img src={appleTouchUrl} alt="Apple" className="w-10 h-10 rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
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
              <div className="flex-1 space-y-1.5">
                {[
                  { label: "Favicon found", ok: favicon.found },
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

function tryHostname(url: string) {
  try { return new URL(url).hostname; } catch { return url; }
}
