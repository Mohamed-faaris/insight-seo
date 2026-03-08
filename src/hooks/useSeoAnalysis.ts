import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SeoReport, ScanRecord } from "@/lib/seo-types";

export function useSeoAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<SeoReport | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (url: string) => {
    setIsAnalyzing(true);
    setError(null);
    setReport(null);

    try {
      // Create scan record
      const { data: scan, error: insertError } = await supabase
        .from("seo_scans")
        .insert({ url, status: "analyzing" })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);

      const record = scan as unknown as ScanRecord;
      setScanId(record.id);
      setShareToken(record.share_token);

      // Call edge function
      const { data, error: fnError } = await supabase.functions.invoke("analyze-seo", {
        body: { url, scanId: record.id },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setReport(data as SeoReport);
    } catch (e: any) {
      setError(e.message || "Analysis failed");
      // Update scan status to failed
      if (scanId) {
        await supabase.from("seo_scans").update({ status: "failed" }).eq("id", scanId);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadFromShareToken = async (token: string) => {
    const { data, error: fetchError } = await supabase
      .from("seo_scans")
      .select("*")
      .eq("share_token", token)
      .single();

    if (fetchError || !data) {
      setError("Report not found");
      return;
    }

    const record = data as unknown as ScanRecord;
    setScanId(record.id);
    setShareToken(record.share_token);
    setReport(record.report);
  };

  const loadHistory = async (): Promise<ScanRecord[]> => {
    const { data, error } = await supabase
      .from("seo_scans")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) return [];
    return (data || []) as unknown as ScanRecord[];
  };

  return { isAnalyzing, report, scanId, shareToken, error, analyze, loadFromShareToken, loadHistory };
}
