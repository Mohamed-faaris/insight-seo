import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ExternalToolsCardProps {
  url: string;
}

const tools = [
  {
    name: "Google Site Search",
    getUrl: (u: string) => `https://www.google.com/search?q=site:${new URL(u).hostname}`,
    color: "text-blue-400",
  },
  {
    name: "PageSpeed Insights",
    getUrl: (u: string) => `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(u)}`,
    color: "text-green-400",
  },
  {
    name: "Rich Results Test",
    getUrl: (u: string) => `https://search.google.com/test/rich-results?url=${encodeURIComponent(u)}`,
    color: "text-cyan-400",
  },
  {
    name: "Ahrefs",
    getUrl: (u: string) => `https://ahrefs.com/site-explorer/overview/v2/subdomains/live?target=${new URL(u).hostname}`,
    color: "text-orange-400",
  },
  {
    name: "Semrush",
    getUrl: (u: string) => `https://www.semrush.com/analytics/overview/?q=${new URL(u).hostname}`,
    color: "text-red-400",
  },
  {
    name: "Moz",
    getUrl: (u: string) => `https://moz.com/domain-analysis?site=${new URL(u).hostname}`,
    color: "text-purple-400",
  },
  {
    name: "SimilarWeb",
    getUrl: (u: string) => `https://www.similarweb.com/website/${new URL(u).hostname}`,
    color: "text-yellow-400",
  },
  {
    name: "Archive.org",
    getUrl: (u: string) => `https://web.archive.org/web/*/${new URL(u).hostname}`,
    color: "text-pink-400",
  },
];

export function ExternalToolsCard({ url }: ExternalToolsCardProps) {
  return (
    <Card className="glass-card">
      <Accordion type="single" collapsible>
        <AccordionItem value="tools" className="border-none">
          <CardHeader className="pb-0">
            <AccordionTrigger className="hover:no-underline py-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <ExternalLink className="h-4 w-4 text-primary" />
                External SEO Tools
              </CardTitle>
            </AccordionTrigger>
          </CardHeader>
          <AccordionContent>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-2">
                {tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.getUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/60 border border-border/30 hover:border-border transition-colors group"
                  >
                    <ExternalLink className={`h-3.5 w-3.5 ${tool.color} shrink-0`} />
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {tool.name}
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
