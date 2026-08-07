import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Landmark,
  Briefcase,
  Gift,
  TrendingUp,
  Wallet,
  ShoppingBag,
  Fish,
  HandCoins,
  Lock,
  Sparkles,
  ShieldCheck,
  MessageSquareText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageShell } from "@/components/layout/PageShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scam Detector AI — Check messages before you click, pay or share" },
      {
        name: "description",
        content:
          "Paste a suspicious message or upload a screenshot. Scam Detector AI identifies warning signs and explains safe next steps in Simple English or Roman Urdu.",
      },
      { property: "og:title", content: "Scam Detector AI — Scam message and screenshot analyser" },
      {
        property: "og:description",
        content:
          "AI-powered scam warning signs, safety guidance and privacy-friendly analysis for suspicious WhatsApp, SMS and email messages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const SCAM_TYPES = [
  { icon: Landmark, title: "Bank impersonation", desc: "Fake alerts pretending to be your bank." },
  { icon: Briefcase, title: "Fake job offers", desc: "Requests for advance fees or personal documents." },
  { icon: Gift, title: "Prize scams", desc: "You won a prize you never entered for." },
  { icon: TrendingUp, title: "Investment scams", desc: "Guaranteed profits and pressure to invest fast." },
  { icon: HandCoins, title: "Loan scams", desc: "Instant loans with an upfront processing fee." },
  { icon: ShoppingBag, title: "Shopping scams", desc: "Deals that look too good on unknown stores." },
  { icon: Fish, title: "Phishing messages", desc: "Fake login pages that steal your credentials." },
  { icon: Wallet, title: "Advance-payment scams", desc: "Send money now to unlock something later." },
];

function Home() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="hero-gradient text-primary-foreground">
        <div className="container-page grid gap-10 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
              AI-powered scam analysis
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Check Before You <span className="text-accent">Click, Pay or Share</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
              Paste a suspicious message or upload a screenshot. Scam Detector AI
              will identify warning signs and explain safe next steps in Simple
              English or Roman Urdu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/analyse">
                  Check a Message <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                <Link to="/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <ShieldCheck className="h-6 w-6 text-accent" aria-hidden />
                <div>
                  <div className="text-sm font-semibold">Sample analysis</div>
                  <div className="text-xs text-white/60">Bank impersonation</div>
                </div>
                <span className="ml-auto rounded-full bg-risk-high px-3 py-1 text-xs font-medium text-risk-high-foreground">
                  High Risk
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                <li>• Urgency: “verify within 30 minutes”</li>
                <li>• Asks for OTP code</li>
                <li>• Suspicious lookalike domain</li>
                <li>• Threatens account suspension</li>
              </ul>
              <div className="mt-5 rounded-md bg-white/5 p-3 text-xs text-white/70">
                Recommended: Do not share the OTP. Verify only through your
                bank’s official app.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported scam types */}
      <section className="container-page py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">Scam types we help with</h2>
          <p className="mt-3 text-muted-foreground">
            Scam Detector AI recognises common patterns across banking, jobs,
            shopping, investment and messaging scams.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SCAM_TYPES.map((s) => (
            <Card key={s.title} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <s.icon className="h-6 w-6 text-accent" aria-hidden />
                <div className="mt-3 font-semibold">{s.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-secondary/40 py-20">
        <div className="container-page">
          <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: MessageSquareText,
                title: "Paste or upload",
                desc: "Share the suspicious message text or a screenshot.",
              },
              {
                icon: Sparkles,
                title: "AI checks warning signs",
                desc: "The AI looks for urgency, impersonation and unsafe requests.",
              },
              {
                icon: ShieldCheck,
                title: "Receive safety guidance",
                desc: "See a plain-language risk assessment and next steps.",
              },
            ].map((s, i) => (
              <div key={s.title} className="rounded-xl border border-border bg-surface p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <s.icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                  Step {i + 1}
                </div>
                <div className="mt-1 text-lg font-semibold">{s.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="container-page py-20">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground">
              <Lock className="h-3.5 w-3.5" aria-hidden /> Privacy first
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Your messages are not stored
            </h2>
            <p className="mt-3 text-muted-foreground">
              We do not permanently keep the content you submit. Suspicious
              links are shown as plain text and never opened automatically.
              Please remove any private details before analysis.
            </p>
          </div>
          <ul className="space-y-3 rounded-xl border border-border bg-surface p-6 text-sm">
            <li className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden />
              Messages and screenshots are not permanently stored.
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden />
              Suspicious links are not automatically opened.
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden />
              Remove passwords, OTPs and card details before submission.
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden />
              AI results are guidance — never a legal guarantee.
            </li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
