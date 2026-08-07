import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer · Scam Detector AI" },
      { name: "description", content: "AI results are guidance, not a guarantee. Always verify important messages independently." },
      { property: "og:title", content: "Disclaimer · Scam Detector AI" },
      { property: "og:description", content: "Important limitations of the Scam Detector AI scam analyser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Disclaimer,
});

function Disclaimer() {
  return (
    <PageShell>
      <article className="container-page max-w-3xl py-16">
        <h1 className="text-4xl font-bold tracking-tight">Disclaimer</h1>
        <div className="mt-6 flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-destructive" aria-hidden />
          <p>
            Scam Detector AI can make mistakes. A “Low Risk” result does not mean a
            message is guaranteed safe. A “High Risk” result is not a legal
            finding of fraud.
          </p>
        </div>
        <ul className="mt-6 list-disc space-y-3 pl-5 text-sm text-muted-foreground">
          <li>Always verify important messages using the sender’s official channel.</li>
          <li>Never share OTP codes, passwords or complete card details.</li>
          <li>Never open links directly from suspicious messages.</li>
          <li>
            If sensitive information or money has already been shared, contact
            your bank immediately and report the incident to your local
            authorities.
          </li>
        </ul>
      </article>
    </PageShell>
  );
}
