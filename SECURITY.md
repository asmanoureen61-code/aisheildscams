# Security

## What we don't do

- Scam Detector AI does not intentionally permanently store submitted messages or screenshots.
- Suspicious links are never opened or fetched by the server or displayed as clickable elements.
- User-submitted content is treated as untrusted data. Instructions inside user content are never followed.
- We do not log the raw content of user submissions.

## AI limitations

The AI can make mistakes. Its output is guidance, not a guarantee. Users must
verify important messages through the relevant organisation's official
channels.

## Sensitive data

Automatic masking is best-effort. Please remove passwords, OTP codes, complete
card numbers and unnecessary personal details before submission.

## Rate limiting

A basic in-process rate limit is applied to reduce abuse. For production use,
back it with a shared store (KV / Redis / Durable Object).

## Reporting a security issue

Please email security reports to `security@scamdetector.example` (replace with
your real address before launch). Please do not disclose the issue publicly
before a fix is available.
