import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TwitterCardData } from "@/lib/seo-types";
import { Twitter } from "lucide-react";

interface TwitterCardPreviewProps {
  twitter: TwitterCardData;
}

export function TwitterCardPreview({ twitter }: TwitterCardPreviewProps) {
  const hasData = twitter.title || twitter.description || twitter.image;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Twitter className="h-4 w-4 text-primary" />
          Twitter Card Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="rounded-lg border border-border overflow-hidden bg-secondary/30">
            {twitter.image && (
              <div className="aspect-video bg-muted overflow-hidden">
                <img
                  src={twitter.image}
                  alt="Twitter Card"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="p-3 space-y-1">
              <p className="text-sm font-semibold text-foreground line-clamp-2">{twitter.title || "No title"}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{twitter.description || "No description"}</p>
              {twitter.card && (
                <p className="text-xs text-muted-foreground">Card type: {twitter.card}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">No Twitter Card tags found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
