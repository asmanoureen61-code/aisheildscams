import { createFileRoute } from "@tanstack/react-router";
import {
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

import { Card, CardContent } from "@/components/ui/card";
import { PageShell } from "@/components/layout/PageShell";
import { CinematicHome } from "@/components/motion/CinematicHome";
import { HeroIntroSection } from "@/components/hero/HeroIntroSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scam Detector AI — Check messages before you click, pay or share" },
      {
        name: "description",
        content:
          "Paste a suspicious message or upload a screenshot. Scam Detector AI identifies warning signs and explains safe next steps in clear English.",
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
    <CinematicHome>
      <PageShell>
        <HeroIntroSection />

        {/* Supported scam types */}
        <section data-cine-section="scams" className="cinematic-scene container-page py-20">
          <div className="mb-10 max-w-2xl">
            <h2 data-cine-reveal="heading" className="text-3xl font-bold tracking-tight">
              Scam types we help with
            </h2>
            <p data-cine-reveal="text" className="mt-3 text-muted-foreground">
              Scam Detector AI recognises common patterns across banking, jobs, shopping, investment
              and messaging scams.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SCAM_TYPES.map((s) => (
              <Card
                key={s.title}
                data-cine-card="scam"
                className="cine-card-3d transition-shadow"
              >
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
        <section
          data-cine-section="steps"
          className="cinematic-scene relative overflow-hidden border-y border-border bg-secondary/40 py-20"
        >
          <div
            data-cine-depth="steps-bg"
            className="cinematic-layer pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent"
            aria-hidden
          />
          <div className="container-page relative">
            <h2 data-cine-reveal="heading" className="text-3xl font-bold tracking-tight">
              How it works
            </h2>
            <div
              data-cine-steps-line
              className="mt-4 h-px w-full max-w-xs origin-left bg-gradient-to-r from-accent/50 to-transparent"
              aria-hidden
            />
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
                <div
                  key={s.title}
                  data-cine-step
                  className="cine-step-card rounded-xl border border-border bg-surface p-6"
                >
                  <div
                    data-cine-step-icon
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent"
                  >
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
        <section data-cine-section="privacy" className="cinematic-scene container-page py-20">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div data-cine-depth="privacy-copy">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground">
                <Lock className="h-3.5 w-3.5" aria-hidden /> Privacy first
              </div>
              <h2
                data-cine-reveal="heading"
                className="mt-4 text-3xl font-bold tracking-tight"
              >
                Your messages are not stored
              </h2>
              <p data-cine-reveal="text" className="mt-3 text-muted-foreground">
                We do not permanently keep the content you submit. Suspicious links are shown as
                plain text and never opened automatically. Please remove any private details before
                analysis.
              </p>
            </div>
            <ul
              data-cine-depth="privacy-panel"
              className="space-y-3 rounded-xl border border-border bg-surface p-6 text-sm"
            >
              <li data-privacy-item className="privacy-item flex gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden />
                Messages and screenshots are not permanently stored.
              </li>
              <li data-privacy-item className="privacy-item flex gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden />
                Suspicious links are not automatically opened.
              </li>
              <li data-privacy-item className="privacy-item flex gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden />
                Remove passwords, OTPs and card details before submission.
              </li>
              <li data-privacy-item className="privacy-item flex gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden />
                AI results are guidance — never a legal guarantee.
              </li>
            </ul>
          </div>
        </section>
      </PageShell>
    </CinematicHome>
  );
}
