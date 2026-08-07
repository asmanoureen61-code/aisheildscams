import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · Scam Detector AI" },
      { name: "description", content: "Get in touch about Scam Detector AI — feedback, security reports, and general questions." },
      { property: "og:title", content: "Contact · Scam Detector AI" },
      { property: "og:description", content: "Reach the Scam Detector AI team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <PageShell>
      <article className="container-page max-w-2xl py-16">
        <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
        <p className="mt-3 text-muted-foreground">
          Questions, feedback or security reports are welcome.
        </p>
        <div className="mt-8 flex items-center gap-3 rounded-md border border-border bg-surface p-4 text-sm">
          <Mail className="h-5 w-5 text-accent" aria-hidden />
          <span className="font-mono">hello@scamdetector.example</span>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Replace the placeholder address with your project contact before
          launch. For security issues, please see the SECURITY.md file in the
          repository.
        </p>
      </article>
    </PageShell>
  );
}
