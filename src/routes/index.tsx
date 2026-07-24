import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScamShield AI — Check messages before you click, pay or share" },
      {
        name: "description",
        content:
          "ScamShield AI analyses suspicious messages and screenshots, flagging scam warning signs in Simple English or Roman Urdu.",
      },
      {
        property: "og:title",
        content: "ScamShield AI — Check messages before you click, pay or share",
      },
      {
        property: "og:description",
        content:
          "Paste a suspicious message or upload a screenshot. ScamShield AI explains the warning signs and safe next steps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Stage 1 · Project scaffold
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          ScamShield AI
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          The project is running. The homepage, message analysis, and screenshot
          upload will be built in the next stages.
        </p>
      </div>
    </main>
  );
}
