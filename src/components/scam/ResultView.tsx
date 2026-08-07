import {
  AlertCircle,
  AlertTriangle,
  Clock,
  EyeOff,
  Gift,
  HandCoins,
  HelpCircle,
  IdCard,
  KeyRound,
  Link2,
  Link as LinkIcon,
  ListChecks,
  MessageSquare,
  Eraser,
  Printer,
  Copy,
  Download,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  VenetianMask,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "./RiskBadge";
import { cn } from "@/lib/utils";
import type { ScamAnalysisResult, RiskLevel, WarningSignType } from "@/types/scam";
import {
  RISK_LABELS,
  SCAM_CATEGORY_LABELS,
  WARNING_SIGN_LABELS,
} from "@/types/scam";

const SCORE_BAR: Record<RiskLevel, string> = {
  low: "bg-risk-low-foreground",
  medium: "bg-risk-medium-foreground",
  high: "bg-risk-high-foreground",
  uncertain: "bg-risk-uncertain-foreground",
};

const WARNING_SIGN_ICONS: Record<WarningSignType, typeof Clock> = {
  urgency: Clock,
  threat: ShieldAlert,
  "otp-request": KeyRound,
  "payment-demand": HandCoins,
  "suspicious-link": Link2,
  impersonation: VenetianMask,
  "personal-information": IdCard,
  "too-good-to-be-true": Gift,
  secrecy: EyeOff,
  other: AlertCircle,
};

const HEADLINE: Record<RiskLevel, string> = {
  low: "No strong warning signs were detected, but this does not prove the message is safe.",
  medium:
    "Some concerning signs were detected. Verify through an official channel before acting.",
  high: "Stop and verify before clicking, paying or sharing information.",
  uncertain:
    "There is not enough clear information to provide a reliable risk assessment.",
};

/**
 * Deterministic safety steps derived from the detected warning signs, so the
 * core advice always appears even if the AI's own action list omits it.
 */
function coreSafetySteps(r: ScamAnalysisResult): string[] {
  const types = new Set(r.warningSigns.map((w) => w.type));
  const steps: string[] = [];
  if (types.has("suspicious-link")) {
    steps.push("Do not open or click any link in this message.");
  }
  if (types.has("otp-request")) {
    steps.push(
      "Do not share OTP codes, PINs or passwords with anyone — real organisations never ask for them.",
    );
  }
  if (types.has("payment-demand")) {
    steps.push("Do not send any money, fee or deposit.");
  }
  if (types.has("personal-information")) {
    steps.push("Do not send identity documents, card numbers or personal details.");
  }
  steps.push(
    "Verify the sender through the organisation's official app, website or helpline — never through contact details inside the message.",
  );
  return steps;
}

function toSafetyAdvice(r: ScamAnalysisResult): string {
  const steps = [...coreSafetySteps(r), ...r.safeActions];
  const unique = [...new Set(steps)];
  return [
    r.isDemo
      ? "Scam Detector AI — Demo safety advice (not a real AI result)"
      : "Scam Detector AI — Safety advice",
    ``,
    `Risk: ${RISK_LABELS[r.riskLevel]} (${r.riskScore}/100)`,
    `Scam type: ${SCAM_CATEGORY_LABELS[r.scamType]}`,
    ``,
    r.scamReason ? `Why this may be a scam:\n${r.scamReason}\n` : "",
    `Safety advice:`,
    ...unique.map((s, i) => `${i + 1}. ${s}`),
    ``,
    r.disclaimer,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function toReport(r: ScamAnalysisResult): string {
  const bullets = (arr: string[]) =>
    arr.length ? arr.map((s) => `- ${s}`).join("\n") : "- (none)";
  return [
    r.isDemo
      ? `Scam Detector AI — DEMO ANALYSIS (not a real AI result)`
      : `Scam Detector AI — Safety Report`,
    ``,
    ...(r.isDemo
      ? [
          `WARNING: The AI service is not connected. This output uses offline demo checks only and must not be treated as a real AI assessment.`,
          ``,
        ]
      : []),
    `Risk level: ${r.riskLevel.toUpperCase()}`,
    `Risk score: ${r.riskScore}/100`,
    `Confidence: ${r.confidence}%`,
    `Category: ${SCAM_CATEGORY_LABELS[r.scamType]}`,
    ``,
    `Summary:`,
    r.explanation,
    ``,
    `Why this may be a scam:`,
    r.scamReason || "(not provided)",
    ``,
    `Warning signs:`,
    r.warningSigns.length
      ? r.warningSigns
          .map((w) => `- ${WARNING_SIGN_LABELS[w.type]}: ${w.detail}`)
          .join("\n")
      : "- (none)",
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
    `Automatic link checks (no links were opened):`,
    r.linkChecks.length
      ? r.linkChecks
          .map(
            (c) =>
              `- ${c.url}\n${
                c.findings.length
                  ? c.findings.map((f) => `  * ${f.note}`).join("\n")
                  : "  * No obvious address tricks detected — the link can still be dangerous."
              }`,
          )
          .join("\n")
      : "- (no links found in the message)",
    ``,
    `Do this first:`,
    bullets(coreSafetySteps(r)),
    ``,
    `Recommended actions:`,
    bullets(r.safeActions),
    ``,
    `Disclaimer: ${r.disclaimer}`,
  ].join("\n");
}

interface Props {
  result: ScamAnalysisResult;
  onReset: () => void;
  onClear: () => void;
}

export function ResultView({ result, onReset, onClear }: Props) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null);
  const report = toReport(result);
  const safetyAdvice = toSafetyAdvice(result);

  async function copySafetyAdvice() {
    try {
      await navigator.clipboard.writeText(safetyAdvice);
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
    a.download = `scam-detector-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {result.isDemo && (
        <div
          role="status"
          className="rounded-lg border-2 border-risk-medium-foreground/40 bg-risk-medium px-4 py-3 text-sm text-risk-medium-foreground"
        >
          <div className="font-semibold tracking-wide">Demo Analysis</div>
          <p className="mt-1">
            The AI service is not connected. This result was produced by basic
            offline checks only and is <strong>not</strong> a real AI assessment.
            Do not treat it as a verified scam verdict.
          </p>
        </div>
      )}

      <Card className={cn("border-2", result.isDemo && "border-risk-medium-foreground/30")}>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <RiskBadge level={result.riskLevel} size="lg" />
              {result.isDemo && (
                <span className="rounded-full bg-risk-medium px-3 py-1 text-xs font-semibold uppercase tracking-wide text-risk-medium-foreground">
                  Demo Analysis
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {result.isDemo ? (
                <>Confidence: <span className="font-semibold text-foreground">N/A (demo)</span></>
              ) : (
                <>
                  Confidence:{" "}
                  <span className="font-semibold text-foreground">{result.confidence}%</span>
                </>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Risk score
              </span>
              <span className="text-2xl font-bold tabular-nums">
                {result.riskScore}
                <span className="text-sm font-normal text-muted-foreground">/100</span>
              </span>
            </div>
            <div
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={result.riskScore}
              aria-label={`Risk score ${result.riskScore} out of 100 — ${RISK_LABELS[result.riskLevel]}`}
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary"
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  SCORE_BAR[result.riskLevel],
                )}
                style={{ width: `${result.riskScore}%` }}
              />
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
              <div className="mt-1 font-medium">
                {SCAM_CATEGORY_LABELS[result.scamType]}
              </div>
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

      {result.scamReason && (
        <Section
          icon={<HelpCircle className="h-4 w-4 text-accent" aria-hidden />}
          title="Why this may be a scam"
        >
          <p dir="auto" className="whitespace-pre-wrap text-sm leading-relaxed">
            {result.scamReason}
          </p>
        </Section>
      )}

      <Section
        icon={<MessageSquare className="h-4 w-4 text-accent" aria-hidden />}
        title="Simple explanation"
      >
        <p dir="auto" className="whitespace-pre-wrap text-sm leading-relaxed">
          {result.explanation || "No explanation was returned."}
        </p>
      </Section>

      <Section
        icon={<AlertTriangle className="h-4 w-4 text-accent" aria-hidden />}
        title="Warning signs"
      >
        {result.warningSigns.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No specific warning signs were extracted.
          </p>
        ) : (
          <ul className="space-y-3">
            {result.warningSigns.map((w, i) => {
              const Icon = WARNING_SIGN_ICONS[w.type];
              return (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-risk-high text-risk-high-foreground">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    <span className="font-medium">
                      {WARNING_SIGN_LABELS[w.type]}
                    </span>
                    <span dir="auto" className="block text-muted-foreground">
                      {w.detail}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

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
        <CardContent className="space-y-4">
          {result.suspiciousLinks.length === 0 &&
            result.linkChecks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No links were found in the message.
              </p>
            )}

          {result.suspiciousLinks.length > 0 && (
            <ul className="space-y-3 text-sm">
              {result.suspiciousLinks.map((l, i) => (
                <li key={i} className="rounded-md border border-border p-3">
                  <div className="break-all font-mono text-xs text-muted-foreground">
                    {l.displayedLink}
                  </div>
                  <div dir="auto" className="mt-1">{l.concern}</div>
                </li>
              ))}
            </ul>
          )}

          {result.linkChecks.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Automatic address checks
              </div>
              <ul className="mt-2 space-y-3 text-sm">
                {result.linkChecks.map((c) => (
                  <li key={c.url} className="rounded-md border border-border p-3">
                    <div className="break-all font-mono text-xs text-muted-foreground">
                      {c.url}
                    </div>
                    {c.findings.length > 0 ? (
                      <ul className="mt-2 space-y-1.5">
                        {c.findings.map((f, i) => (
                          <li key={i} className="flex gap-2">
                            <AlertTriangle
                              className="mt-0.5 h-3.5 w-3.5 flex-none text-risk-high-foreground"
                              aria-hidden
                            />
                            {f.note}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">
                        No obvious address tricks detected — the link can still
                        be dangerous, so verify before opening.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Links are shown as plain text, never clickable, and checks are done
            on the address text only — no link is ever opened.
          </p>
        </CardContent>
      </Card>

      <Section
        icon={<ListChecks className="h-4 w-4 text-accent" aria-hidden />}
        title="Recommended actions"
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide">
              Do this first
            </div>
            <ul className="mt-2 space-y-2 text-sm">
              {coreSafetySteps(result).map((s) => (
                <li key={s} className="flex gap-2">
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 flex-none text-accent"
                    aria-hidden
                  />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          {result.safeActions.length > 0 ? (
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {result.safeActions.map((s, i) => (
                <li key={i} dir="auto">{s}</li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">
              No further specific actions were suggested.
            </p>
          )}
        </div>
      </Section>

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

      <div
        dir="auto"
        className="rounded-md border border-border bg-secondary/40 p-4 text-xs text-muted-foreground"
      >
        {result.disclaimer}
      </div>

      <div className="no-print flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={onReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Analyse Another Message
        </Button>
        <Button variant="outline" size="sm" onClick={copySafetyAdvice}>
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Copied" : "Copy Safety Advice"}
        </Button>
        <Button variant="outline" size="sm" onClick={onClear}>
          <Eraser className="mr-2 h-4 w-4" />
          Clear Result
        </Button>
        <Button variant="ghost" size="sm" onClick={downloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Download as TXT
        </Button>
        <Button variant="ghost" size="sm" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>

      <div className="no-print flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted-foreground">Was this analysis helpful?</span>
        <Button
          variant={feedback === "helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => setFeedback("helpful")}
        >
          Yes
        </Button>
        <Button
          variant={feedback === "not-helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => setFeedback("not-helpful")}
        >
          No
        </Button>
        {feedback && (
          <span className="text-xs text-muted-foreground">
            Thanks for your feedback.
          </span>
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
                  <li key={i} dir="auto">{s}</li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-sm">
                {items.map((s, i) => (
                  <li key={i} dir="auto">{s}</li>
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
