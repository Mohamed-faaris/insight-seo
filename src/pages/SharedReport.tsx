import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSeoAnalysis } from "@/hooks/useSeoAnalysis";
import { ScoreGauge } from "@/components/seo/ScoreGauge";
import { MetaSummary } from "@/components/seo/MetaSummary";
import { OpenGraphPreview } from "@/components/seo/OpenGraphPreview";
import { HeadingChart } from "@/components/seo/HeadingChart";
import { LinkStats } from "@/components/seo/LinkStats";
import { IssuesList } from "@/components/seo/IssuesList";
import { PageInfoCard } from "@/components/seo/PageInfoCard";
import { ImageAnalysisCard } from "@/components/seo/ImageAnalysisCard";
import { ContentCard } from "@/components/seo/ContentCard";
import { TechnicalCard } from "@/components/seo/TechnicalCard";
import { PerformanceCard } from "@/components/seo/PerformanceCard";
import { ExternalToolsCard } from "@/components/seo/ExternalToolsCard";
import { GooglePreviewCard } from "@/components/seo/GooglePreviewCard";
import { KeywordDensityCard } from "@/components/seo/KeywordDensityCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Search } from "lucide-react";

const SharedReport = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { report, error, loadFromShareToken } = useSeoAnalysis();

  useEffect(() => {
    if (token) loadFromShareToken(token);
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

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
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            New Scan
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">SEO Report</h2>
          <p className="text-muted-foreground text-sm">
            {report.url} · Scanned {new Date(report.scanDate).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="flex items-center justify-center">
            <ScoreGauge score={report.seoScore} size={180} />
          </div>
          <div className="lg:col-span-3">
            <IssuesList issues={report.issues} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <PageInfoCard info={report.pageInfo} siteUrl={report.finalUrl} />
          <MetaSummary meta={report.metaTags} />
          <GooglePreviewCard url={report.finalUrl} title={report.metaTags.title} description={report.metaTags.description} favicon={report.favicon} siteUrl={report.finalUrl} />
          <OpenGraphPreview og={report.openGraph} twitter={report.twitterCard} siteUrl={report.finalUrl} />
          <HeadingChart headings={report.headings} />
          <LinkStats links={report.links} />
          <ImageAnalysisCard images={report.images} />
          <ContentCard content={report.content} />
          <TechnicalCard technical={report.technical} security={report.security} structuredData={report.structuredData} />
          <PerformanceCard performance={report.performance} />
          <ExternalToolsCard url={report.finalUrl} />
        </div>
      </div>
    </div>
  );
};

export default SharedReport;
