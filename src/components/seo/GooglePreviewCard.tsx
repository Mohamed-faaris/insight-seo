import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface GooglePreviewCardProps {
  url: string;
  title: string;
  description: string;
}

export function GooglePreviewCard({ url, title, description }: GooglePreviewCardProps) {
  let displayUrl = url;
  try {
    displayUrl = new URL(url).href;
  } catch {}

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="h-4 w-4 text-primary" />
          Google Search Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-1">
          <p className="text-xs text-muted-foreground truncate">{displayUrl}</p>
          <p className="text-sm font-medium text-[hsl(210_100%_56%)] line-clamp-2 hover:underline cursor-pointer">
            {title || "No title found"}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description || "No meta description found"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
