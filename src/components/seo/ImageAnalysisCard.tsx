import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImageAnalysis } from "@/lib/seo-types";
import { ImageIcon, AlertTriangle, Check } from "lucide-react";

interface ImageAnalysisCardProps {
  images: ImageAnalysis;
}

export function ImageAnalysisCard({ images }: ImageAnalysisCardProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ImageIcon className="h-4 w-4 text-primary" />
          Image SEO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold">{images.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: images.missingAlt > 0 ? "hsl(var(--warning) / 0.1)" : "hsl(var(--success) / 0.1)" }}>
            <p className="text-2xl font-bold">{images.missingAlt}</p>
            <p className="text-xs text-muted-foreground">Missing Alt</p>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: images.brokenImages > 0 ? "hsl(var(--destructive) / 0.1)" : "hsl(var(--success) / 0.1)" }}>
            <p className="text-2xl font-bold">{images.brokenImages}</p>
            <p className="text-xs text-muted-foreground">Broken</p>
          </div>
        </div>

        {images.images.length > 0 && (
          <div className="max-h-40 overflow-y-auto space-y-1.5">
            {images.images.slice(0, 15).map((img, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {img.isMissingAlt ? (
                  <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
                ) : (
                  <Check className="h-3 w-3 text-success shrink-0" />
                )}
                <span className="truncate text-muted-foreground">{img.src || "(no src)"}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
