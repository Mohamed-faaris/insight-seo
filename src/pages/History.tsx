import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useSeoAnalysis } from "@/hooks/useSeoAnalysis";
import type { ScanRecord } from "@/lib/seo-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, ExternalLink, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const History = () => {
  const navigate = useNavigate();
  const { loadHistory } = useSeoAnalysis();
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory().then((data) => {
      setScans(data);
      setLoading(false);
    });
  }, []);

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

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
        <h2 className="text-2xl font-bold mb-6">Scan History</h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : scans.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No scans yet</p>
            <Button onClick={() => navigate("/")}>Run Your First Scan</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan, i) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="glass-card cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => {
                    if (scan.share_token && scan.status === "completed") {
                      navigate(`/report/${scan.share_token}`);
                    }
                  }}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`text-3xl font-bold w-16 text-center ${getScoreColor(scan.seo_score)}`}>
                      {scan.seo_score ?? "—"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{scan.url}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(scan.created_at).toLocaleString()}
                        </div>
                        <Badge variant={scan.status === "completed" ? "default" : scan.status === "failed" ? "destructive" : "secondary"} className="text-xs">
                          {scan.status}
                        </Badge>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
