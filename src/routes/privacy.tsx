import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy · Scam Detector AI" },
      { name: "description", content: "What we collect, what we don't store, and how AI processes your submitted content." },
      { property: "og:title", content: "Privacy policy · Scam Detector AI" },
      { property: "og:description", content: "How Scam Detector AI handles the messages and screenshots you submit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <PageShell>
      <article className="container-page prose prose-slate max-w-3xl py-16">
        <h1 className="text-4xl font-bold tracking-tight">Privacy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: today.</p>

        <h2 className="mt-8 text-xl font-semibold">What you provide</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You may paste message text or upload a screenshot. You choose whether
          your response is in Simple English or Roman Urdu.
        </p>

        <h2 className="mt-6 text-xl font-semibold">Why content is sent to an AI service</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The submitted content is forwarded to an AI provider so it can be
          analysed for scam warning signs. Your submission is transmitted only
          to perform this analysis.
        </p>

        <h2 className="mt-6 text-xl font-semibold">Storage</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Scam Detector AI does not intentionally permanently store the messages or
          screenshots you submit. The AI provider may process the content per
          their own data terms — please review those before relying on this
          service in a production setting.
        </p>

        <h2 className="mt-6 text-xl font-semibold">Sensitive information</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please remove passwords, OTP codes, full card numbers and unnecessary
          personal details before submission. Our automatic masking is
          best-effort and may not detect every private detail.
        </p>

        <h2 className="mt-6 text-xl font-semibold">Guidance, not a guarantee</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Results are general safety guidance. A low-risk result does not prove
          a message is safe. Always verify through official channels.
        </p>
      </article>
    </PageShell>
  );
}
