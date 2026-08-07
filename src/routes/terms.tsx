import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of use · Scam Detector AI" },
      { name: "description", content: "Acceptable use, limitations and disclaimers for the Scam Detector AI service." },
      { property: "og:title", content: "Terms of use · Scam Detector AI" },
      { property: "og:description", content: "How you may use Scam Detector AI and the limitations that apply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <PageShell>
      <article className="container-page max-w-3xl py-16">
        <h1 className="text-4xl font-bold tracking-tight">Terms of use</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          By using Scam Detector AI you agree to the following terms.
        </p>

        <h2 className="mt-8 text-xl font-semibold">Acceptable use</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Do not submit content that violates any law or another person’s
          rights. Do not attempt to abuse, overload or reverse-engineer the
          service. Automated bulk analysis is not permitted.
        </p>

        <h2 className="mt-6 text-xl font-semibold">No warranty</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The service is provided “as is”, without warranty. AI results are
          general guidance and may be incorrect. The operators are not liable
          for damages arising from use of the service.
        </p>

        <h2 className="mt-6 text-xl font-semibold">Not legal or financial advice</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A risk assessment from Scam Detector AI is not a legal finding of fraud
          and is not financial advice.
        </p>
      </article>
    </PageShell>
  );
}
