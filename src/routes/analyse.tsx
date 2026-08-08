import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, Loader2, ScanText } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MessageTextarea, isValidMessage } from "@/components/scam/MessageTextarea";
import { ScreenshotUpload } from "@/components/scam/ScreenshotUpload";
import { PrivacyNotice } from "@/components/scam/PrivacyNotice";
import { ConfirmationCheckbox } from "@/components/scam/ConfirmationCheckbox";
import { ResultSkeleton, ResultView } from "@/components/scam/ResultView";
import type {
  ApiResponse,
  ExtractedScreenshotText,
  ScamAnalysisResult,
} from "@/types/scam";

export const Route = createFileRoute("/analyse")({
  head: () => ({
    meta: [
      { title: "Analyse a message · Scam Detector AI" },
      {
        name: "description",
        content:
          "Paste a suspicious WhatsApp, SMS or email message, or upload a screenshot, and get an AI safety assessment.",
      },
      { property: "og:title", content: "Analyse a message · Scam Detector AI" },
      {
        property: "og:description",
        content:
          "Get an AI risk assessment for suspicious text messages and screenshots in clear English.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalysePage,
});

type Tab = "text" | "image";
type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; data: ScamAnalysisResult };
type Extraction =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "done"; isReadable: boolean };

const MAX_EXTRACTED = 5000;

function AnalysePage() {
  const [tab, setTab] = useState<Tab>("text");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [extraction, setExtraction] = useState<Extraction>({ kind: "idle" });
  const [extractedText, setExtractedText] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const canSubmit = useMemo(() => {
    if (!confirmed || status.kind === "loading") return false;
    return tab === "text"
      ? isValidMessage(message)
      : extraction.kind === "done" && isValidMessage(extractedText);
  }, [tab, message, extraction, extractedText, confirmed, status.kind]);

  function handleFileChange(f: File | null) {
    setFile(f);
    setExtraction({ kind: "idle" });
    setExtractedText("");
  }

  async function extractText() {
    if (!file || extraction.kind === "loading") return;
    setExtraction({ kind: "loading" });
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/extract-text", { method: "POST", body: fd });
      const json = (await res.json()) as ApiResponse<ExtractedScreenshotText>;
      if (!json.success) {
        setExtraction({ kind: "error", message: json.error.message });
        return;
      }
      setExtractedText(json.data.extractedText);
      setExtraction({ kind: "done", isReadable: json.data.isReadable });
    } catch {
      setExtraction({
        kind: "error",
        message: "Could not reach the extraction service. Please try again.",
      });
    }
  }

  async function submit() {
    if (!canSubmit) return;
    setStatus({ kind: "loading" });
    try {
      const fd = new FormData();
      // Screenshots are analysed via their reviewed extracted text.
      fd.append("inputType", "text");
      fd.append("message", (tab === "text" ? message : extractedText).trim());

      const res = await fetch("/api/analyse-scam", { method: "POST", body: fd });
      const json = (await res.json()) as ApiResponse<ScamAnalysisResult>;
      if (!json.success) {
        setStatus({ kind: "error", message: json.error.message });
        return;
      }
      setStatus({ kind: "success", data: json.data });
    } catch {
      setStatus({
        kind: "error",
        message: "Could not reach the analysis service. Please try again.",
      });
    }
  }

  function reset() {
    setStatus({ kind: "idle" });
    setMessage("");
    setFile(null);
    setExtraction({ kind: "idle" });
    setExtractedText("");
  }

  function clearResult() {
    setStatus({ kind: "idle" });
  }

  return (
    <PageShell>
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:py-14">
        {/* Input */}
        <section className="no-print">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Analyse a message</h1>
            <p className="mt-2 text-muted-foreground">
              Paste a suspicious message or upload a screenshot, then confirm
              the disclaimer to continue. Results are returned in English.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your input</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Paste Message</TabsTrigger>
                  <TabsTrigger value="image">Upload Screenshot</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4">
                  <MessageTextarea value={message} onChange={setMessage} />
                </TabsContent>
                <TabsContent value="image" className="mt-4 space-y-4">
                  <ScreenshotUpload file={file} onChange={handleFileChange} />

                  {file && extraction.kind !== "done" && (
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={extractText}
                      disabled={extraction.kind === "loading"}
                    >
                      {extraction.kind === "loading" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Extracting text…
                        </>
                      ) : (
                        <>
                          <ScanText className="mr-2 h-4 w-4" />
                          Extract Text from Screenshot
                        </>
                      )}
                    </Button>
                  )}

                  {extraction.kind === "error" && (
                    <p role="alert" className="text-sm text-destructive">
                      {extraction.message}
                    </p>
                  )}

                  {extraction.kind === "done" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="extracted-text" className="text-sm font-medium">
                          Review the extracted text
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={extractText}
                        >
                          Re-extract
                        </Button>
                      </div>
                      {!extraction.isReadable && (
                        <p className="rounded-md bg-risk-medium px-3 py-2 text-xs text-risk-medium-foreground">
                          The screenshot could not be read clearly. Type the
                          message text below yourself, or upload a clearer
                          screenshot.
                        </p>
                      )}
                      <Textarea
                        id="extracted-text"
                        value={extractedText}
                        onChange={(e) => setExtractedText(e.target.value)}
                        placeholder="The text read from your screenshot appears here — check and correct it before analysing..."
                        rows={8}
                        maxLength={MAX_EXTRACTED}
                        aria-describedby="extracted-help"
                        className="resize-y bg-surface"
                      />
                      <div
                        id="extracted-help"
                        className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"
                      >
                        <span>
                          Fix any reading mistakes. Remove passwords or OTP codes.
                        </span>
                        <span>
                          {extractedText.length} / {MAX_EXTRACTED}
                        </span>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-6 space-y-4">
                <PrivacyNotice />
                <ConfirmationCheckbox checked={confirmed} onChange={setConfirmed} />
              </div>

              <Button
                className="mt-6 w-full"
                size="lg"
                disabled={!canSubmit}
                onClick={submit}
              >
                {status.kind === "loading"
                  ? "Analysing…"
                  : tab === "text"
                    ? "Analyse Message"
                    : "Analyse Extracted Text"}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Result */}
        <section aria-live="polite">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Result</h2>
            <p className="mt-2 text-muted-foreground">
              Guidance appears here after analysis. Nothing is stored.
            </p>
          </div>
          {status.kind === "idle" && (
            <Card>
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                Submit a message or screenshot to see the AI safety guidance.
              </CardContent>
            </Card>
          )}
          {status.kind === "loading" && <ResultSkeleton />}
          {status.kind === "error" && (
            <Card className="border-destructive/60">
              <CardContent className="flex flex-col items-start gap-3 py-8">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Analysis failed</span>
                </div>
                <p className="text-sm text-muted-foreground">{status.message}</p>
                <Button variant="outline" onClick={submit}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}
          {status.kind === "success" && (
            <ResultView
              result={status.data}
              onReset={reset}
              onClear={clearResult}
            />
          )}
        </section>
      </div>
    </PageShell>
  );
}
