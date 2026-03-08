import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibilityAnalysis } from "@/lib/seo-types";
import { ScoreGauge } from "./ScoreGauge";
import { IssuesList } from "./IssuesList";
import { Accessibility, CheckCircle2, XCircle, AlertTriangle, Globe, FormInput, MousePointerClick, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  accessibility: AccessibilityAnalysis;
}

export const AccessibilityCard = ({ accessibility }: Props) => {
  const { landmarks, semanticElements, formInputs, ariaUsage, buttonsWithoutText, emptyLinks, lang, hasSkipNav, positiveTabindex } = accessibility;

  const semanticTotal = Object.values(semanticElements).reduce((a, b) => a + b, 0);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Accessibility className="h-4 w-4 text-primary" />
          Accessibility Analysis
          <Badge variant={accessibility.score >= 80 ? "default" : accessibility.score >= 50 ? "secondary" : "destructive"} className="ml-auto text-xs">
            Score: {accessibility.score}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Landmarks */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Landmark className="h-3.5 w-3.5 text-muted-foreground" />
            ARIA Landmarks
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.entries(landmarks).map(([name, count]) => (
              <div key={name} className="flex items-center gap-1.5 text-xs rounded-md bg-muted/50 px-2.5 py-1.5">
                {count > 0 ? <CheckCircle2 className="h-3 w-3 text-chart-3 shrink-0" /> : <XCircle className="h-3 w-3 text-destructive shrink-0" />}
                <span className="capitalize">{name}</span>
                <span className="text-muted-foreground ml-auto">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Semantic HTML */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            Semantic HTML ({semanticTotal} elements)
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(semanticElements).map(([tag, count]) => (
              <Badge key={tag} variant={count > 0 ? "default" : "outline"} className="text-xs font-mono">
                &lt;{tag}&gt; {count}
              </Badge>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        {formInputs.total > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
              <FormInput className="h-3.5 w-3.5 text-muted-foreground" />
              Form Labels
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-md bg-muted/50 px-2.5 py-1.5 text-center">
                <div className="font-semibold text-foreground">{formInputs.total}</div>
                <div className="text-muted-foreground">Total</div>
              </div>
              <div className="rounded-md bg-muted/50 px-2.5 py-1.5 text-center">
                <div className="font-semibold text-chart-3">{formInputs.withLabels}</div>
                <div className="text-muted-foreground">Labeled</div>
              </div>
              <div className="rounded-md bg-muted/50 px-2.5 py-1.5 text-center">
                <div className="font-semibold text-destructive">{formInputs.withoutLabels}</div>
                <div className="text-muted-foreground">Unlabeled</div>
              </div>
            </div>
            {formInputs.unlabeled.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1.5">
                Unlabeled: {formInputs.unlabeled.join(", ")}
              </p>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="rounded-md bg-muted/50 px-2.5 py-2 text-center">
            <div className="font-semibold text-foreground">{ariaUsage}</div>
            <div className="text-muted-foreground">ARIA attrs</div>
          </div>
          <div className="rounded-md bg-muted/50 px-2.5 py-2 text-center">
            <div className="font-semibold text-foreground">{lang || "—"}</div>
            <div className="text-muted-foreground">Lang</div>
          </div>
          <div className="rounded-md bg-muted/50 px-2.5 py-2 text-center">
            <div className={`font-semibold ${hasSkipNav ? "text-chart-3" : "text-muted-foreground"}`}>{hasSkipNav ? "Yes" : "No"}</div>
            <div className="text-muted-foreground">Skip Nav</div>
          </div>
          <div className="rounded-md bg-muted/50 px-2.5 py-2 text-center">
            <div className={`font-semibold ${positiveTabindex > 0 ? "text-destructive" : "text-chart-3"}`}>{positiveTabindex}</div>
            <div className="text-muted-foreground">Bad tabindex</div>
          </div>
        </div>

        {/* Issues */}
        <IssuesList issues={accessibility.issues} />
      </CardContent>
    </Card>
  );
};
