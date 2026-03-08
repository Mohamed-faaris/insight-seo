import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onAnalyze, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = url.trim();
    if (!finalUrl) return;
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }
    onAnalyze(finalUrl);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter website URL to analyze..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="pl-10 h-12 text-base bg-card border-border/50 focus:border-primary"
          disabled={isLoading}
        />
      </div>
      <Button type="submit" size="lg" className="h-12 px-6 gradient-primary" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze"
        )}
      </Button>
    </motion.form>
  );
}
