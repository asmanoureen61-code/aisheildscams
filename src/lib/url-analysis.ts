import type { UrlCheck, UrlCheckFinding } from "@/types/scam";

/**
 * Deterministic, offline URL analysis. Inspects only the address text —
 * URLs are NEVER fetched, resolved or opened.
 */

const MAX_URLS = 10;

const SHORTENERS = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "cutt.ly",
  "rb.gy",
  "is.gd",
  "v.gd",
  "tiny.cc",
  "t.ly",
  "rebrand.ly",
  "shorturl.at",
  "ow.ly",
  "buff.ly",
  "s.id",
  "lnkd.in",
  "short.io",
]);

const RISKY_TLDS = new Set([
  "tk",
  "ml",
  "ga",
  "cf",
  "gq",
  "xyz",
  "top",
  "icu",
  "buzz",
  "click",
  "rest",
  "monster",
  "zip",
  "stream",
  "country",
]);

interface Brand {
  name: string;
  tokens: string[];
  official: string[];
}

const BRANDS: Brand[] = [
  { name: "HBL", tokens: ["hbl"], official: ["hbl.com", "hbl.com.pk", "hblibank.com.pk"] },
  { name: "UBL", tokens: ["ubl"], official: ["ubl.com.pk", "ubldigital.com"] },
  { name: "Meezan Bank", tokens: ["meezan"], official: ["meezanbank.com"] },
  { name: "JazzCash", tokens: ["jazzcash"], official: ["jazzcash.com.pk"] },
  { name: "Easypaisa", tokens: ["easypaisa"], official: ["easypaisa.com.pk"] },
  { name: "State Bank of Pakistan", tokens: ["sbp"], official: ["sbp.org.pk"] },
  { name: "PayPal", tokens: ["paypal"], official: ["paypal.com"] },
  { name: "WhatsApp", tokens: ["whatsapp"], official: ["whatsapp.com", "wa.me"] },
  { name: "Facebook", tokens: ["facebook"], official: ["facebook.com", "fb.com"] },
  { name: "Instagram", tokens: ["instagram"], official: ["instagram.com"] },
  { name: "Google", tokens: ["google"], official: ["google.com"] },
  { name: "Microsoft", tokens: ["microsoft"], official: ["microsoft.com"] },
  { name: "Apple", tokens: ["apple", "icloud"], official: ["apple.com", "icloud.com"] },
  { name: "Amazon", tokens: ["amazon"], official: ["amazon.com"] },
  { name: "Netflix", tokens: ["netflix"], official: ["netflix.com"] },
];

const URL_RE =
  /(?:https?:\/\/[^\s<>"'()]+)|(?:(?<![@\w.])(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,24}\b(?:\/[^\s<>"'()]*)?)/gi;

/** Common look-alike character substitutions used in scam domains. */
function unleet(s: string): string {
  return s
    .replace(/vv/g, "w")
    .replace(/rn/g, "m")
    .replace(/0/g, "o")
    .replace(/1/g, "l")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b");
}

function levenshtein(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => i);
  for (let j = 1; j <= b.length; j++) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= a.length; i++) {
      const tmp = dp[i];
      dp[i] = Math.min(
        dp[i] + 1,
        dp[i - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      prev = tmp;
    }
  }
  return dp[a.length];
}

const CC_SLD = new Set(["com", "co", "org", "net", "gov", "edu", "ac"]);

/** Naive registrable domain: last 2 labels, or 3 for country-code domains like example.com.pk. */
function registrableDomain(host: string): string {
  const labels = host.split(".");
  if (labels.length <= 2) return host;
  const tld = labels[labels.length - 1];
  const sld = labels[labels.length - 2];
  if (tld.length === 2 && CC_SLD.has(sld)) return labels.slice(-3).join(".");
  return labels.slice(-2).join(".");
}

function getHost(url: string): string | null {
  try {
    const withScheme = /^https?:\/\//i.test(url) ? url : `http://${url}`;
    return new URL(withScheme).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function checkUrl(url: string): UrlCheck {
  const findings: UrlCheckFinding[] = [];
  const host = getHost(url);
  if (!host) return { url, findings };

  const reg = registrableDomain(host);
  const secondLevel = reg.split(".")[0];

  if (/^http:\/\//i.test(url)) {
    findings.push({
      kind: "insecure-http",
      note: "Uses insecure http:// — real organisations use https://.",
    });
  }

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    findings.push({
      kind: "ip-address",
      note: "Points to a raw IP address instead of a named website.",
    });
  }

  if (host.split(".").some((l) => l.startsWith("xn--"))) {
    findings.push({
      kind: "punycode",
      note: "Contains encoded (punycode) characters that can disguise look-alike letters.",
    });
  }

  if (SHORTENERS.has(reg)) {
    findings.push({
      kind: "shortener",
      note: "Shortened link — the real destination is hidden until opened.",
    });
  }

  const tld = host.split(".").pop() ?? "";
  if (RISKY_TLDS.has(tld)) {
    findings.push({
      kind: "suspicious-tld",
      note: `The ".${tld}" domain ending is frequently used in scam campaigns.`,
    });
  }

  const beforePath = url.replace(/^https?:\/\//i, "").split("/")[0];
  if (beforePath.includes("@")) {
    findings.push({
      kind: "at-symbol",
      note: "Contains an @ symbol — everything before it is a decoy; the real site comes after.",
    });
  }

  if (host.split(".").length >= 5) {
    findings.push({
      kind: "many-subdomains",
      note: "Uses many subdomains, often done to bury a fake brand name in the address.",
    });
  }

  const unleetedHost = unleet(host);
  if (unleetedHost !== host) {
    findings.push({
      kind: "digit-substitution",
      note: "Uses digits or letter pairs that imitate other letters (like 0 for o, or vv for w).",
    });
  }

  for (const brand of BRANDS) {
    if (brand.official.includes(reg)) break; // official domain — no impersonation
    const hostMatches = brand.tokens.some((t) => unleetedHost.includes(t));
    const closeToOfficial = brand.official.some((o) => {
      const officialLabel = o.split(".")[0];
      return (
        officialLabel.length >= 4 &&
        secondLevel.length >= 4 &&
        levenshtein(unleet(secondLevel), officialLabel) <= 2
      );
    });
    if (hostMatches || closeToOfficial) {
      findings.push({
        kind: "lookalike",
        note: `Looks like it imitates ${brand.name}, but it is not an official ${brand.name} domain (${brand.official[0]}).`,
      });
      break;
    }
  }

  return { url, findings };
}

/** Extract up to MAX_URLS unique URLs from text and analyse each offline. */
export function analyseUrls(text: string): UrlCheck[] {
  const seen = new Set<string>();
  const checks: UrlCheck[] = [];
  for (const match of text.matchAll(URL_RE)) {
    const raw = match[0].replace(/[.,;:!?]+$/, "");
    const key = raw.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    checks.push(checkUrl(raw));
    if (checks.length >= MAX_URLS) break;
  }
  return checks;
}
