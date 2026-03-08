import { useState, useEffect } from "react";
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
import { AccessibilityCard } from "@/components/seo/AccessibilityCard";
import { exportReportAsPdf } from "@/lib/pdf-export";
import { Button } from "@/components/ui/button";
import { Download, Share2, History, Search, Loader2, Swords, Sun, Moon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const { isAnalyzing, report, shareToken, error, analyze } = useSeoAnalysis();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Auto-analyze from ?url= query param
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam && !report && !isAnalyzing) {
      analyze(urlParam);
    }
  }, []);

  // Sync URL to query params after analysis
  useEffect(() => {
    if (report?.url) {
      setSearchParams({ url: report.url }, { replace: true });
    }
  }, [report]);

  const handleAnalyze = (url: string) => {
    setSearchParams({ url }, { replace: true });
    analyze(url);
  };

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="https://cusptech.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Search className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight">
              <span className="text-primary">SEO</span>Audit
            </h1>
          </a>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => navigate("/compare")} className="text-muted-foreground hover:text-foreground">
              <Swords className="h-4 w-4 mr-2" />
              Compare
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="text-muted-foreground hover:text-foreground">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
            <UrlInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} defaultUrl={searchParams.get("url") || ""} />
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
            <UrlInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} defaultUrl={searchParams.get("url") || ""} />
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
              <UrlInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} defaultUrl={searchParams.get("url") || ""} />
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
            {report.manifest && <ManifestCard manifest={report.manifest} siteUrl={report.finalUrl} />}
            {report.accessibility && <AccessibilityCard accessibility={report.accessibility} />}
            <ExternalToolsCard url={report.finalUrl} />
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-border/50 bg-card/30 py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            Built by{" "}
            <a href="https://cusptech.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              CuspTech
            </a>
          </p>
          <a href="https://github.com/Mohamed-faaris" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1.5">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
