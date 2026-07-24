# Testing checklist

## Automated (where practical)

- `src/lib/masking.ts` — mask phones, emails, CNICs, cards, OTPs, passwords.
- `src/routes/api/analyse-scam.ts` — input validation for text length, image
  MIME type and size, language, and inputType.
- `src/types/scam.ts` — `RiskLevel` and label consistency.

## Manual scenarios

Text:
- Normal family message
- Fake bank OTP request
- Fake job offer requesting an advance fee
- Investment message promising guaranteed profit
- Prize / lottery scam
- Loan scam with processing fee
- Shopping scam on unknown store
- Family impersonation
- OTP / password / remote-access request
- Shortened link
- Misspelled domain
- Message without a link

Screenshots:
- Clear screenshot
- Blurry screenshot (expect `isReadable: false`)
- Cropped screenshot
- Dark screenshot
- Non-message image (photo)

Language: Simple English and Roman Urdu.

Devices: mobile, tablet, desktop.

Network: slow connection, API failure, repeated button clicks.

## Review

- No API keys in the browser bundle.
- No `console.log` of submitted content.
- No `dangerouslySetInnerHTML`.
- Suspicious links rendered as plain text only.
- Missing input rejected on both client and server.
