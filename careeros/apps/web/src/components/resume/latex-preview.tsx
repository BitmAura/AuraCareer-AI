"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCode, ExternalLink, Copy, Check, Sparkles, Download } from "lucide-react";
import { toast } from "sonner";

interface LatexPreviewProps {
  latexSource: string;
  overleafUrl: string;
  matchedKeywords?: string[];
  suggestedAdditions?: string[];
  roleTitle?: string;
  companyName?: string;
}

export function LatexPreview({
  latexSource,
  overleafUrl,
  matchedKeywords = [],
  suggestedAdditions = [],
  roleTitle = "Target Role",
  companyName,
}: LatexPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latexSource);
      setCopied(true);
      toast.success("LaTeX source code copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy LaTeX code.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([latexSource], { type: "application/x-tex" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Resume_${roleTitle.replace(/\s+/g, "_")}_ATS.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded .tex resume file!");
  };

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
              <FileCode className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Overleaf & LaTeX ATS Resume Synthesizer</CardTitle>
              <CardDescription className="text-xs">
                Tailored for {roleTitle} {companyName ? `at ${companyName}` : ""} • ATS Compliant & Fact-Preserved
              </CardDescription>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleCopy}>
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Code"}
          </Button>

          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5" />
            Download .tex
          </Button>

          <Button
            size="sm"
            className="h-8 text-xs gap-1.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm"
            onClick={() => window.open(overleafUrl, "_blank")}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Open in Overleaf (1-Click)
            <ExternalLink className="h-3 w-3 opacity-70" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Keywords alignment banner */}
        {(matchedKeywords.length > 0 || suggestedAdditions.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/40 rounded-lg border border-border/40 text-xs">
            {matchedKeywords.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-medium text-foreground">Matched JD Keywords:</span>
                {matchedKeywords.slice(0, 8).map((kw) => (
                  <Badge key={kw} variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    ✓ {kw}
                  </Badge>
                ))}
              </div>
            )}
            {suggestedAdditions.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-1 sm:mt-0">
                <span className="font-medium text-muted-foreground">Missing from JD:</span>
                {suggestedAdditions.slice(0, 5).map((kw) => (
                  <Badge key={kw} variant="outline" className="text-[10px] opacity-70">
                    + {kw}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Syntax highlight code block */}
        <div className="relative rounded-lg bg-zinc-950 p-4 font-mono text-xs text-zinc-100 overflow-x-auto max-h-100 border border-zinc-800">
          <pre className="leading-relaxed">
            <code>{latexSource}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
