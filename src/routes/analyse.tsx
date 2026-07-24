import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageSelector } from "@/components/scam/LanguageSelector";
import { MessageTextarea, isValidMessage } from "@/components/scam/MessageTextarea";
import { ScreenshotUpload } from "@/components/scam/ScreenshotUpload";
import { PrivacyNotice } from "@/components/scam/PrivacyNotice";
import { ConfirmationCheckbox } from "@/components/scam/ConfirmationCheckbox";
import { ResultSkeleton, ResultView } from "@/components/scam/ResultView";
import type { ApiResponse, Language, ScamAnalysisResult } from "@/types/scam";

export const Route = createFileRoute("/analyse")({
  head: () => ({
    meta: [
      { title: "Analyse a message · ScamShield AI" },
      {
        name: "description",
        content:
          "Paste a suspicious WhatsApp, SMS or email message, or upload a screenshot, and get an AI safety assessment.",
      },
      { property: "og:title", content: "Analyse a message · ScamShield AI" },
      {
        property: "og:description",
        content:
          "Get an AI risk assessment for suspicious text messages and screenshots in Simple English or Roman Urdu.",
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

function AnalysePage() {
  const [tab, setTab] = useState<Tab>("text");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<Language | "">("");
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const canSubmit = useMemo(() => {
    if (!language || !confirmed || status.kind === "loading") return false;
    return tab === "text" ? isValidMessage(message) : file !== null;
  }, [tab, message, file, language, confirmed, status.kind]);

  async function submit() {
    if (!canSubmit) return;
    setStatus({ kind: "loading" });
    try {
      const fd = new FormData();
      fd.append("language", language as string);
      fd.append("inputType", tab);
      if (tab === "text") fd.append("message", message.trim());
      else if (file) fd.append("image", file);

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
  }

  return (
    <PageShell>
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:py-14">
        {/* Input */}
        <section className="no-print">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Analyse a message</h1>
            <p className="mt-2 text-muted-foreground">
              Paste a suspicious message or upload a screenshot. Choose the
              response language and confirm the disclaimer to continue.
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
                <TabsContent value="image" className="mt-4">
                  <ScreenshotUpload file={file} onChange={setFile} />
                </TabsContent>
              </Tabs>

              <div className="mt-6 space-y-4">
                <LanguageSelector value={language} onChange={setLanguage} />
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
                    : "Analyse Screenshot"}
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
            <ResultView result={status.data} onReset={reset} />
          )}
        </section>
      </div>
    </PageShell>
  );
}
