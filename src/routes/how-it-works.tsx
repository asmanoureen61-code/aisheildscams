import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquareText, Sparkles, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works · Scam Detector AI" },
      { name: "description", content: "Three steps: paste or upload, AI checks warning signs, receive safety guidance." },
      { property: "og:title", content: "How Scam Detector AI works" },
      { property: "og:description", content: "See the three-step scam analysis flow used by Scam Detector AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  { icon: MessageSquareText, title: "Paste or upload", body: "Share suspicious message text or a screenshot. We do not permanently store what you submit." },
  { icon: Sparkles, title: "AI checks warning signs", body: "The AI reviews the content for urgency, impersonation, unsafe requests and suspicious links." },
  { icon: ShieldCheck, title: "Receive safety guidance", body: "You get a plain-language risk assessment with recommended safety actions." },
];

function HowItWorks() {
  return (
    <PageShell>
      <div className="container-page py-16">
        <h1 className="text-4xl font-bold tracking-tight">How it works</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Scam Detector AI is designed to be cautious. It flags warning signs and
          recommends verification, but it never claims a message is 100% safe.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Card key={s.title}>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <s.icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                  Step {i + 1}
                </div>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{s.body}</CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild size="lg">
            <Link to="/analyse">Try it now</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
