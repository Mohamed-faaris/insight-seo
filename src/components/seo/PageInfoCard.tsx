import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PageInfo } from "@/lib/seo-types";
import { Globe, Clock, ArrowRight } from "lucide-react";

interface PageInfoCardProps {
  info: PageInfo;
  siteUrl: string;
}

export function PageInfoCard({ info }: PageInfoCardProps) {
  const statusColor = info.statusCode === 200 ? "success" : info.statusCode >= 400 ? "destructive" : "warning";

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
      </CardContent>
    </Card>
  );
}
