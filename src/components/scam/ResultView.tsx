import {
  AlertTriangle,
  Link as LinkIcon,
  ListChecks,
  MessageSquare,
  Printer,
  Copy,
  Download,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "./RiskBadge";
import type { ScamAnalysisResult, RiskLevel } from "@/types/scam";

const HEADLINE: Record<RiskLevel, string> = {
  low: "No strong warning signs were detected, but this does not prove the message is safe.",
  medium:
    "Some concerning signs were detected. Verify through an official channel before acting.",
  high: "Stop and verify before clicking, paying or sharing information.",
  uncertain:
    "There is not enough clear information to provide a reliable risk assessment.",
};

function toReport(r: ScamAnalysisResult): string {
  const bullets = (arr: string[]) =>
    arr.length ? arr.map((s) => `- ${s}`).join("\n") : "- (none)";
  return [
    `ScamShield AI — Safety Report`,
    ``,
    `Risk level: ${r.riskLevel.toUpperCase()}`,
    `Confidence: ${r.confidence}%`,
    `Category: ${r.scamCategory}`,
    ``,
    `Summary:`,
    r.summary,
    ``,
    `Warning signs:`,
    bullets(r.warningSigns),
    ``,
    `Suspicious requests:`,
    bullets(r.suspiciousRequests),
    ``,
    `Link concerns:`,
    r.suspiciousLinks.length
      ? r.suspiciousLinks
          .map((l) => `- ${l.displayedLink} — ${l.concern}`)
          .join("\n")
      : "- (none)",
    ``,
    `Recommended actions:`,
    bullets(r.recommendedActions),
    ``,
    `Disclaimer: ${r.disclaimer}`,
  ].join("\n");
}

interface Props {
  result: ScamAnalysisResult;
  onReset: () => void;
}

export function ResultView({ result, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null);
  const report = toReport(result);

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors.
    }
  }

  function downloadReport() {
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scamshield-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <RiskBadge level={result.riskLevel} size="lg" />
            <div className="text-xs text-muted-foreground">
              Confidence:{" "}
              <span className="font-semibold text-foreground">{result.confidence}%</span>
            </div>
          </div>
          <CardTitle className="text-xl">{HEADLINE[result.riskLevel]}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Possible scam type
              </div>
              <div className="mt-1 font-medium">{result.scamCategory}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Screenshot readable
              </div>
              <div className="mt-1 font-medium">
                {result.isReadable ? "Yes" : "No — analysis may be limited"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Section
        icon={<MessageSquare className="h-4 w-4 text-accent" aria-hidden />}
        title="Simple explanation"
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {result.summary || "No summary was returned."}
        </p>
      </Section>

      <Section
        icon={<AlertTriangle className="h-4 w-4 text-accent" aria-hidden />}
        title="Warning signs"
        empty="No specific warning signs were extracted."
        items={result.warningSigns}
      />

      <Section
        icon={<ListChecks className="h-4 w-4 text-accent" aria-hidden />}
        title="Suspicious requests"
        empty="No specific suspicious requests were extracted."
        items={result.suspiciousRequests}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <LinkIcon className="h-4 w-4 text-accent" aria-hidden />
            Link concerns
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.suspiciousLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No suspicious links were extracted.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {result.suspiciousLinks.map((l, i) => (
                <li key={i} className="rounded-md border border-border p-3">
                  <div className="break-all font-mono text-xs text-muted-foreground">
                    {l.displayedLink}
                  </div>
                  <div className="mt-1">{l.concern}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Links are shown as plain text and are never clickable.
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Section
        icon={<ListChecks className="h-4 w-4 text-accent" aria-hidden />}
        title="Recommended actions"
        empty="No specific actions were suggested."
        items={result.recommendedActions}
        ordered
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Confidence explanation</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          The confidence value reflects how sure the AI is about its own risk
          assessment. It is not proof of safety or fraud, and it should not be
          used as a legal finding.
        </CardContent>
      </Card>

      <div className="rounded-md border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
        {result.disclaimer}
      </div>

      <div className="no-print flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={copyReport}>
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Copied" : "Copy Safety Report"}
        </Button>
        <Button variant="outline" size="sm" onClick={downloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Download as TXT
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button size="sm" onClick={onReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Analyse Another Message
        </Button>
      </div>

      <div className="no-print flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">Was this helpful?</span>
        <Button
          variant={feedback === "helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => setFeedback("helpful")}
        >
          Helpful
        </Button>
        <Button
          variant={feedback === "not-helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => setFeedback("not-helpful")}
        >
          Not helpful
        </Button>
        {feedback && (
          <span className="text-xs text-muted-foreground">Thanks for the feedback.</span>
        )}
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  items,
  empty,
  ordered,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  items?: string[];
  empty?: string;
  ordered?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children ??
          (items && items.length > 0 ? (
            ordered ? (
              <ol className="list-decimal space-y-2 pl-5 text-sm">
                {items.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-sm">
                {items.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              {empty ?? "Nothing to show."}
            </p>
          ))}
      </CardContent>
    </Card>
  );
}

export function ResultSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-lg bg-secondary" />
      <div className="h-40 animate-pulse rounded-lg bg-secondary" />
      <div className="h-32 animate-pulse rounded-lg bg-secondary" />
      <div className="h-32 animate-pulse rounded-lg bg-secondary" />
    </div>
  );
}
