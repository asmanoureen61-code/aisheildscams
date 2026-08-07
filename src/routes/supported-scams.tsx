import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import {
  Landmark, Briefcase, Gift, TrendingUp, Wallet, ShoppingBag, Fish, HandCoins,
} from "lucide-react";

export const Route = createFileRoute("/supported-scams")({
  head: () => ({
    meta: [
      { title: "Supported scams · Scam Detector AI" },
      { name: "description", content: "Bank impersonation, fake jobs, prize scams, investment, loan, shopping, phishing and advance-payment scams." },
      { property: "og:title", content: "Scam types Scam Detector AI recognises" },
      { property: "og:description", content: "A quick reference of the scam categories Scam Detector AI can help flag." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SupportedScams,
});

const ITEMS = [
  { icon: Landmark, title: "Bank impersonation", desc: "Messages pretending to be from your bank asking you to verify or unlock your account." },
  { icon: Briefcase, title: "Fake job offers", desc: "Employment offers that require training or processing fees, or ask for personal documents up front." },
  { icon: Gift, title: "Prize scams", desc: "Claims that you won a lottery or gift you never entered for, often asking for a delivery fee." },
  { icon: TrendingUp, title: "Investment scams", desc: "Promises of guaranteed daily returns, celebrity endorsements or urgent buying windows." },
  { icon: HandCoins, title: "Loan scams", desc: "Instant, no-check loans that require an upfront processing fee before disbursement." },
  { icon: ShoppingBag, title: "Shopping scams", desc: "Unrealistically cheap deals on unknown storefronts and unfamiliar payment methods." },
  { icon: Fish, title: "Phishing messages", desc: "Fake login pages that copy real brands to steal your username and password." },
  { icon: Wallet, title: "Advance-payment scams", desc: "Anything requiring you to send money first to unlock a reward, job or service later." },
];

function SupportedScams() {
  return (
    <PageShell>
      <div className="container-page py-16">
        <h1 className="text-4xl font-bold tracking-tight">Scam types we cover</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          These are the most common patterns Scam Detector AI checks for. The tool
          may still miss new or unusual scams — always verify important messages
          through the organisation’s official channel.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((s) => (
            <Card key={s.title}>
              <CardContent className="p-5">
                <s.icon className="h-6 w-6 text-accent" aria-hidden />
                <div className="mt-3 font-semibold">{s.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
