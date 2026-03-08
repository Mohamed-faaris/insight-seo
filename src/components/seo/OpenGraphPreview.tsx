import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OpenGraphData } from "@/lib/seo-types";
import { Share2 } from "lucide-react";

interface OpenGraphPreviewProps {
  og: OpenGraphData;
}

export function OpenGraphPreview({ og }: OpenGraphPreviewProps) {
  const hasData = og.title || og.description || og.image;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Share2 className="h-4 w-4 text-primary" />
          Open Graph Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="rounded-lg border border-border overflow-hidden bg-secondary/30">
            {og.image && (
              <div className="aspect-video bg-muted overflow-hidden">
                <img
                  src={og.image}
                  alt="OG Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="p-3 space-y-1">
              {og.siteName && (
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{og.siteName}</p>
              )}
              <p className="text-sm font-semibold text-foreground line-clamp-2">{og.title || "No title"}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{og.description || "No description"}</p>
              {og.url && <p className="text-xs text-muted-foreground truncate">{og.url}</p>}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">No Open Graph tags found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
