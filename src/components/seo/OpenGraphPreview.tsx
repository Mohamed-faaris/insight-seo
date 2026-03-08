import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OpenGraphData } from "@/lib/seo-types";
import { Share2, Facebook, MessageCircle, Globe, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OpenGraphPreviewProps {
  og: OpenGraphData;
}

export function OpenGraphPreview({ og }: OpenGraphPreviewProps) {
  const hasData = og.title || og.description || og.image;

  const ogProperties = [
    { key: "og:title", value: og.title },
    { key: "og:description", value: og.description },
    { key: "og:image", value: og.image },
    { key: "og:url", value: og.url },
    { key: "og:site_name", value: og.siteName },
    { key: "og:type", value: og.type },
    { key: "og:locale", value: og.locale },
    { key: "og:image:width", value: og.imageWidth },
    { key: "og:image:height", value: og.imageHeight },
    { key: "og:image:alt", value: og.imageAlt },
  ];

  return (
    <Card className="glass-card xl:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Share2 className="h-4 w-4 text-primary" />
          Open Graph Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasData ? (
          <Tabs defaultValue="facebook" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-3">
              <TabsTrigger value="facebook" className="text-xs">Facebook</TabsTrigger>
              <TabsTrigger value="linkedin" className="text-xs">LinkedIn</TabsTrigger>
              <TabsTrigger value="discord" className="text-xs">Discord</TabsTrigger>
            </TabsList>

            {/* Facebook Preview */}
            <TabsContent value="facebook">
              <div className="rounded-lg border border-border overflow-hidden bg-secondary/30 max-w-md">
                {og.image && (
                  <div className="aspect-[1.91/1] bg-muted overflow-hidden">
                    <img src={og.image} alt="OG" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
                <div className="p-3 space-y-0.5 border-t border-border/50">
                  {og.url && <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">{new URL(og.url).hostname}</p>}
                  <p className="text-sm font-semibold text-foreground line-clamp-2">{og.title || "Untitled"}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{og.description || ""}</p>
                </div>
              </div>
            </TabsContent>

            {/* LinkedIn Preview */}
            <TabsContent value="linkedin">
              <div className="rounded-lg border border-border overflow-hidden bg-secondary/30 max-w-md">
                {og.image && (
                  <div className="aspect-[1.91/1] bg-muted overflow-hidden">
                    <img src={og.image} alt="OG" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
                <div className="p-3 space-y-1 border-t border-border/50">
                  <p className="text-sm font-semibold text-foreground line-clamp-2">{og.title || "Untitled"}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{og.url || ""}</p>
                </div>
              </div>
            </TabsContent>

            {/* Discord Preview */}
            <TabsContent value="discord">
              <div className="rounded-lg overflow-hidden max-w-md border-l-4 border-l-primary bg-secondary/50 p-3">
                {og.siteName && <p className="text-[10px] text-muted-foreground font-medium mb-1">{og.siteName}</p>}
                <p className="text-sm font-semibold text-primary line-clamp-2">{og.title || "Untitled"}</p>
                <p className="text-xs text-muted-foreground line-clamp-3 mt-1">{og.description || ""}</p>
                {og.image && (
                  <div className="mt-2 rounded overflow-hidden max-w-xs">
                    <img src={og.image} alt="OG" className="w-full object-cover rounded" style={{ maxHeight: 200 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-32 rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">No Open Graph tags found</p>
          </div>
        )}

        {/* Properties Table */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">OG Properties</p>
          {ogProperties.map((prop) => (
            <div key={prop.key} className="flex items-center gap-2 text-xs">
              {prop.value ? (
                <Check className="h-3 w-3 text-success shrink-0" />
              ) : (
                <X className="h-3 w-3 text-muted-foreground shrink-0" />
              )}
              <span className="font-mono text-muted-foreground w-28 shrink-0">{prop.key}</span>
              <span className="truncate text-foreground">{prop.value || "—"}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
