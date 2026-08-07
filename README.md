# Scam Detector AI

AI-powered scam detection web app. Paste a suspicious WhatsApp / SMS / email
message or upload a screenshot, and Scam Detector AI will flag warning signs and
suggest safe next steps in **Simple English** or **Roman Urdu**.

## Features

- Paste a suspicious message (WhatsApp, SMS, email, job offer, payment request).
- Upload a screenshot (JPG, PNG, WEBP, up to 5 MB).
- Choose response language: Simple English or Roman Urdu.
- Risk assessment: Low, Medium, High, or Unable to Confirm.
- Warning signs, suspicious requests, and link concerns.
- Recommended safety actions.
- Confidence score with clear explanation.
- Copy, download and print the safety report.
- Automatic best-effort masking of obvious sensitive data (phones, emails, CNIC, cards, OTPs).
- Suspicious links are never clickable.
- Content is not permanently stored.

## Tech stack

- TanStack Start (React 19 + Vite 7)
- TypeScript
- Tailwind CSS v4
- Lovable AI Gateway (via Vercel AI SDK)
- Zod for schema validation

## Local development

```bash
bun install
bun run dev
```

## Environment variables

`LOVABLE_API_KEY` is provisioned automatically inside Lovable. When running
outside Lovable, add it to `.env.local` (server-side only, never prefix with
`VITE_`).

## Testing

See `TESTING.md`.

## Security

See `SECURITY.md`.
