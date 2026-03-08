import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSeoAnalysis } from "@/hooks/useSeoAnalysis";
import { useTheme } from "@/hooks/useTheme";
import { UrlInput } from "@/components/seo/UrlInput";
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
import { ManifestCard } from "@/components/seo/ManifestCard";
import { exportReportAsPdf } from "@/lib/pdf-export";
import { Button } from "@/components/ui/button";
import { Download, Share2, History, Search, Loader2, Swords, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const { isAnalyzing, report, shareToken, error, analyze } = useSeoAnalysis();
  const navigate = useNavigate();

  const handleShare = () => {
    if (!shareToken) return;
    const url = `${window.location.origin}/report/${shareToken}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard!");
  };

  const handleExportPdf = async () => {
    if (!report) return;
    toast.promise(exportReportAsPdf(report), {
      loading: "Generating PDF...",
      success: "PDF exported!",
      error: "Failed to export PDF",
    });
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight">
              <span className="text-primary">SEO</span>Audit
            </h1>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => navigate("/compare")} className="text-muted-foreground hover:text-foreground">
              <Swords className="h-4 w-4 mr-2" />
              Compare
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="text-muted-foreground hover:text-foreground">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </div>
      </header>

      {/* Hero / Input */}
      <AnimatePresence mode="wait">
        {!report && !isAnalyzing && (
          <motion.section
            key="hero"
            className="flex flex-col items-center justify-center py-32 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Analyze Your Website's{" "}
              <span className="bg-clip-text text-transparent gradient-primary">SEO Health</span>
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground text-center mb-10 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Get a comprehensive SEO audit with actionable insights. Analyze meta tags, headings, links, structured data, and more.
            </motion.p>
            <UrlInput onAnalyze={analyze} isLoading={isAnalyzing} />
          </motion.section>
        )}

        {isAnalyzing && (
          <motion.section
            key="loading"
            className="flex flex-col items-center justify-center py-32 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
            <h3 className="text-xl font-semibold mb-2">Analyzing website...</h3>
            <p className="text-muted-foreground text-sm">Crawling, parsing, and scoring your page</p>
          </motion.section>
        )}
      </AnimatePresence>

      {error && !isAnalyzing && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto p-6 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
            <p className="text-destructive font-medium mb-4">{error}</p>
            <UrlInput onAnalyze={analyze} isLoading={isAnalyzing} />
          </div>
        </div>
      )}

      {/* Report */}
      {report && !isAnalyzing && (
        <motion.div
          id="seo-report"
          className="container mx-auto px-4 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Report Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex-1 min-w-0">
              <UrlInput onAnalyze={analyze} isLoading={isAnalyzing} />
              <p className="text-xs text-muted-foreground mt-2">
                Final URL: {report.finalUrl} · Scanned {new Date(report.scanDate).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPdf}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          {/* Score + Summary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center justify-center">
              <ScoreGauge score={report.seoScore} size={180} />
            </div>
            <div className="lg:col-span-3">
              <IssuesList issues={report.issues} />
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <PageInfoCard info={report.pageInfo} siteUrl={report.finalUrl} />
            <MetaSummary meta={report.metaTags} />
            <GooglePreviewCard url={report.finalUrl} title={report.metaTags.title} description={report.metaTags.description} favicon={report.favicon} siteUrl={report.finalUrl} />
            <OpenGraphPreview og={report.openGraph} twitter={report.twitterCard} siteUrl={report.finalUrl} />
            <HeadingChart headings={report.headings} />
            <LinkStats links={report.links} />
            <ImageAnalysisCard images={report.images} />
            <ContentCard content={report.content} />
            <KeywordDensityCard content={report.content} />
            <TechnicalCard
              technical={report.technical}
              security={report.security}
              structuredData={report.structuredData}
            />
            <PerformanceCard performance={report.performance} />
            <ExternalToolsCard url={report.finalUrl} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
