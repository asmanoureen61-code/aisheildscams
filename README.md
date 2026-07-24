# ScamShield AI

AI-powered scam detection web app. Paste a suspicious WhatsApp / SMS / email
message or upload a screenshot, and ScamShield AI will flag warning signs and
suggest safe next steps in **Simple English** or **Roman Urdu**.

> Stage 1 — project scaffold only. AI analysis, upload, and result UI arrive
> in later stages.

## Tech stack

- TanStack Start (React 19 + Vite 7)
- TypeScript
- Tailwind CSS v4
- Lovable AI Gateway (added in a later stage)

## Folder structure

```
src/
  routes/              # File-based routes (TanStack Router)
  components/
    layout/            # Header, footer, shell components
    scam/              # Scam-analysis specific components
    ui/                # Reusable UI primitives
  lib/                 # Shared libs (AI client, error reporting, etc.)
  types/               # Shared TypeScript types
  utils/               # Pure utility functions
```

## Local development

```bash
bun install
bun run dev
```

## Environment variables

Copy `.env.example` to `.env.local`. No keys are required for Stage 1.

## Safety principles

- Messages and screenshots are never permanently stored.
- Suspicious links are never auto-opened.
- AI results are guidance, not a guarantee — always verify through official channels.
