import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { SeoReport } from "@/lib/seo-types";
import { ScoreGauge } from "@/components/seo/ScoreGauge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, ArrowLeft, Loader2, Swords, Check, X, TrendingUp, TrendingDown, Minus,
  FileText, Link2, ImageIcon, Heading, Shield, Code2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

const Compare = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [url1, setUrl1] = useState(searchParams.get("url1") || "");
  const [url2, setUrl2] = useState(searchParams.get("url2") || "");
  const [report1, setReport1] = useState<SeoReport | null>(null);
  const [report2, setReport2] = useState<SeoReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-compare from query params
  useEffect(() => {
    const u1 = searchParams.get("url1");
    const u2 = searchParams.get("url2");
    if (u1 && u2 && !report1 && !report2 && !loading) {
      handleCompareUrls(u1, u2);
    }
  }, []);

  const analyzeUrl = async (url: string): Promise<SeoReport> => {
    const { data, error } = await supabase.functions.invoke("analyze-seo", {
      body: { url },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data as SeoReport;
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    let u1 = url1.trim();
    let u2 = url2.trim();
    if (!u1 || !u2) return;
    if (!u1.startsWith("http")) u1 = "https://" + u1;
    if (!u2.startsWith("http")) u2 = "https://" + u2;

    setLoading(true);
    setError(null);
    setReport1(null);
    setReport2(null);

    try {
      const [r1, r2] = await Promise.all([analyzeUrl(u1), analyzeUrl(u2)]);
      setReport1(r1);
      setReport2(r2);
    } catch (e: any) {
      setError(e.message || "Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  const CompareIndicator = ({ a, b, higherIsBetter = true }: { a: number; b: number; higherIsBetter?: boolean }) => {
    if (a === b) return <Minus className="h-4 w-4 text-muted-foreground" />;
    const aWins = higherIsBetter ? a > b : a < b;
    return aWins ? <TrendingUp className="h-4 w-4 text-success" /> : <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const MetricRow = ({ label, val1, val2, higherIsBetter = true, format }: {
    label: string; val1: number; val2: number; higherIsBetter?: boolean; format?: (v: number) => string;
  }) => {
    const fmt = format || ((v: number) => String(v));
    const a1Better = higherIsBetter ? val1 >= val2 : val1 <= val2;
    const a2Better = higherIsBetter ? val2 >= val1 : val2 <= val1;
    return (
      <div className="grid grid-cols-3 gap-4 py-2.5 border-b border-border/30 items-center">
        <div className={`text-sm font-medium text-right ${a1Better && val1 !== val2 ? "text-success" : ""}`}>{fmt(val1)}</div>
        <div className="text-xs text-muted-foreground text-center">{label}</div>
        <div className={`text-sm font-medium ${a2Better && val1 !== val2 ? "text-success" : ""}`}>{fmt(val2)}</div>
      </div>
    );
  };

  const BoolRow = ({ label, val1, val2 }: { label: string; val1: boolean; val2: boolean }) => (
    <div className="grid grid-cols-3 gap-4 py-2.5 border-b border-border/30 items-center">
      <div className="flex justify-end">{val1 ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-destructive" />}</div>
      <div className="text-xs text-muted-foreground text-center">{label}</div>
      <div>{val2 ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-destructive" />}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background dark">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight">
              <span className="text-primary">SEO</span>Audit
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Input Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Swords className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Competitor Comparison</h2>
          </div>
          <p className="text-muted-foreground mb-8">Compare two websites' SEO performance side-by-side</p>

          <form onSubmit={handleCompare} className="flex flex-col sm:flex-row items-center gap-3 max-w-3xl mx-auto">
            <Input
              placeholder="Your website URL"
              value={url1}
              onChange={(e) => setUrl1(e.target.value)}
              className="h-12 bg-card border-border/50"
              disabled={loading}
            />
            <span className="text-muted-foreground font-bold text-sm shrink-0">VS</span>
            <Input
              placeholder="Competitor URL"
              value={url2}
              onChange={(e) => setUrl2(e.target.value)}
              className="h-12 bg-card border-border/50"
              disabled={loading}
            />
            <Button type="submit" className="h-12 px-8 gradient-primary shrink-0" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Compare"}
            </Button>
          </form>
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Analyzing both websites...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {report1 && report2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Score Comparison */}
            <Card className="glass-card">
              <CardContent className="p-8">
                <div className="grid grid-cols-3 gap-8 items-center">
                  <div className="text-center">
                    <ScoreGauge score={report1.seoScore} size={150} label={new URL(report1.url).hostname} />
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-muted-foreground mb-2">VS</div>
                    <div className="text-sm text-muted-foreground">
                      {report1.seoScore > report2.seoScore
                        ? `${new URL(report1.url).hostname} wins by ${report1.seoScore - report2.seoScore} points`
                        : report2.seoScore > report1.seoScore
                        ? `${new URL(report2.url).hostname} wins by ${report2.seoScore - report1.seoScore} points`
                        : "It's a tie!"}
                    </div>
                  </div>
                  <div className="text-center">
                    <ScoreGauge score={report2.seoScore} size={150} label={new URL(report2.url).hostname} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Score Bar Chart */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getCategoryData(report1, report2)}>
                      <XAxis dataKey="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                      <Legend />
                      <Bar dataKey="site1" name={new URL(report1.url).hostname} fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="site2" name={new URL(report2.url).hostname} fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content & Meta */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-primary" />
                    Content & Meta
                  </CardTitle>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <p className="text-xs text-primary text-right font-medium truncate">{new URL(report1.url).hostname}</p>
                    <p className="text-xs text-muted-foreground text-center">Metric</p>
                    <p className="text-xs text-chart-5 font-medium truncate">{new URL(report2.url).hostname}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Title Length" val1={report1.metaTags.titleLength} val2={report2.metaTags.titleLength} higherIsBetter={false} />
                  <MetricRow label="Desc Length" val1={report1.metaTags.descriptionLength} val2={report2.metaTags.descriptionLength} />
                  <MetricRow label="Word Count" val1={report1.content.wordCount} val2={report2.content.wordCount} />
                  <MetricRow label="Readability" val1={report1.content.readabilityScore} val2={report2.content.readabilityScore} />
                  <MetricRow label="H1 Count" val1={report1.headings.h1.length} val2={report2.headings.h1.length} />
                  <MetricRow label="H2 Count" val1={report1.headings.h2.length} val2={report2.headings.h2.length} />
                </CardContent>
              </Card>

              {/* Links & Images */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Link2 className="h-4 w-4 text-primary" />
                    Links & Images
                  </CardTitle>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <p className="text-xs text-primary text-right font-medium truncate">{new URL(report1.url).hostname}</p>
                    <p className="text-xs text-muted-foreground text-center">Metric</p>
                    <p className="text-xs text-chart-5 font-medium truncate">{new URL(report2.url).hostname}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Internal Links" val1={report1.links.internal} val2={report2.links.internal} />
                  <MetricRow label="External Links" val1={report1.links.external} val2={report2.links.external} />
                  <MetricRow label="Total Images" val1={report1.images.total} val2={report2.images.total} />
                  <MetricRow label="Missing Alt" val1={report1.images.missingAlt} val2={report2.images.missingAlt} higherIsBetter={false} />
                  <MetricRow label="Load Time" val1={report1.pageInfo.loadTime} val2={report2.pageInfo.loadTime} higherIsBetter={false} format={(v) => `${(v / 1000).toFixed(2)}s`} />
                </CardContent>
              </Card>

              {/* Technical */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="h-4 w-4 text-primary" />
                    Technical & Security
                  </CardTitle>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <p className="text-xs text-primary text-right font-medium truncate">{new URL(report1.url).hostname}</p>
                    <p className="text-xs text-muted-foreground text-center">Check</p>
                    <p className="text-xs text-chart-5 font-medium truncate">{new URL(report2.url).hostname}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <BoolRow label="HTTPS" val1={report1.security.isHttps} val2={report2.security.isHttps} />
                  <BoolRow label="robots.txt" val1={report1.technical.hasRobotsTxt} val2={report2.technical.hasRobotsTxt} />
                  <BoolRow label="Sitemap" val1={report1.technical.hasSitemap} val2={report2.technical.hasSitemap} />
                  <BoolRow label="Structured Data" val1={report1.structuredData.hasStructuredData} val2={report2.structuredData.hasStructuredData} />
                  <BoolRow label="No Mixed Content" val1={!report1.security.hasMixedContent} val2={!report2.security.hasMixedContent} />
                  <BoolRow label="Indexable" val1={!report1.technical.hasNoindex} val2={!report2.technical.hasNoindex} />
                </CardContent>
              </Card>

              {/* Issues Summary */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Code2 className="h-4 w-4 text-primary" />
                    Issues Summary
                  </CardTitle>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <p className="text-xs text-primary text-right font-medium truncate">{new URL(report1.url).hostname}</p>
                    <p className="text-xs text-muted-foreground text-center">Type</p>
                    <p className="text-xs text-chart-5 font-medium truncate">{new URL(report2.url).hostname}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <MetricRow label="Critical" val1={report1.issues.filter(i => i.severity === "critical").length} val2={report2.issues.filter(i => i.severity === "critical").length} higherIsBetter={false} />
                  <MetricRow label="Warnings" val1={report1.issues.filter(i => i.severity === "warning").length} val2={report2.issues.filter(i => i.severity === "warning").length} higherIsBetter={false} />
                  <MetricRow label="Passed" val1={report1.issues.filter(i => i.severity === "pass").length} val2={report2.issues.filter(i => i.severity === "pass").length} />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

function getCategoryData(r1: SeoReport, r2: SeoReport) {
  const countPasses = (issues: { severity: string }[]) => {
    const total = issues.length || 1;
    const passed = issues.filter(i => i.severity === "pass").length;
    return Math.round((passed / total) * 100);
  };

  return [
    { category: "Meta", site1: countPasses(r1.metaTags.issues), site2: countPasses(r2.metaTags.issues) },
    { category: "OG", site1: countPasses(r1.openGraph.issues), site2: countPasses(r2.openGraph.issues) },
    { category: "Headings", site1: countPasses(r1.headings.issues), site2: countPasses(r2.headings.issues) },
    { category: "Images", site1: countPasses(r1.images.issues), site2: countPasses(r2.images.issues) },
    { category: "Links", site1: countPasses(r1.links.issues), site2: countPasses(r2.links.issues) },
    { category: "Technical", site1: countPasses(r1.technical.issues), site2: countPasses(r2.technical.issues) },
    { category: "Security", site1: countPasses(r1.security.issues), site2: countPasses(r2.security.issues) },
  ];
}

export default Compare;
