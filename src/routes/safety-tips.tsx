import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/safety-tips")({
  head: () => ({
    meta: [
      { title: "Safety tips · ScamShield AI" },
      { name: "description", content: "Practical scam-safety tips: never share OTPs, verify via official apps, slow down under pressure." },
      { property: "og:title", content: "Safety tips from ScamShield AI" },
      { property: "og:description", content: "A short, practical guide to staying safe from common scams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SafetyTips,
});

const TIPS = [
  "Never share OTP codes, passwords or full card numbers — no bank will ever ask for them.",
  "Verify important messages using an officially published phone number, app or website you already trust.",
  "Slow down when a message creates urgency, secrecy or fear. That pressure is the scam.",
  "Do not click links in unexpected messages. Type the address yourself into a browser.",
  "Do not pay ‘processing fees’ for jobs, loans or prizes.",
  "If money or information has already been shared, contact your bank immediately.",
];

function SafetyTips() {
  return (
    <PageShell>
      <div className="container-page py-16">
        <h1 className="text-4xl font-bold tracking-tight">Safety tips</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A short, practical list you can share with friends and family.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {TIPS.map((t) => (
            <Card key={t}>
              <CardContent className="flex items-start gap-3 p-5 text-sm">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-accent" aria-hidden />
                <span>{t}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
