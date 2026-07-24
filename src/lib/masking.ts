/**
 * Best-effort masking of obvious sensitive data before it leaves the server.
 * This is intentionally conservative — never treat it as a guarantee.
 */

type Replacer = (substring: string, ...args: unknown[]) => string;

const PATTERNS: Array<{ re: RegExp; mask: Replacer }> = [
  // CNIC-style: 5-7-1
  { re: /\b\d{5}[- ]?\d{7}[- ]?\d\b/g, mask: () => "*****-*******-*" },
  // Payment cards: 13-19 digits with optional spaces/dashes
  {
    re: /\b(?:\d[ -]?){12,18}\d\b/g,
    mask: ((m: string) => {
      const digits = m.replace(/\D/g, "");
      if (digits.length < 13 || digits.length > 19) return m;
      return `**** **** **** ${digits.slice(-4)}`;
    }) as Replacer,
  },
  // Pakistani mobile numbers
  { re: /\b(?:\+?92|0)3\d{2}[- ]?\d{7}\b/g, mask: () => "03** *** ****" },
  // Generic long international phone numbers
  {
    re: /\+\d{1,3}[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}/g,
    mask: () => "+** *** *** ****",
  },
  // Emails
  {
    re: /\b([A-Za-z0-9._%+-])([A-Za-z0-9._%+-]*)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g,
    mask: ((_m: string, first: string, _rest: string, domain: string) =>
      `${first}***@${domain}`) as Replacer,
  },
  // OTP-ish codes near words otp / code / pin
  {
    re: /\b(otp|code|pin|passcode)[^\d]{0,10}(\d{4,8})\b/gi,
    mask: ((_m: string, label: string) => `${label} ******`) as Replacer,
  },
  // Password: "password: xxxx"
  { re: /\b(password|pwd)\s*[:=]\s*\S+/gi, mask: () => "password: ******" },
];

export function maskSensitive(input: string): string {
  if (!input) return input;
  let out = input;
  for (const { re, mask } of PATTERNS) {
    out = out.replace(re, mask);
  }
  return out;
}

export function maskArray(items: string[]): string[] {
  return items.map(maskSensitive);
}
