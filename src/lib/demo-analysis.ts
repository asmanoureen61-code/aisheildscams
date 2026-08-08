import { analyseUrls } from "@/lib/url-analysis";
import {
  DEFAULT_DISCLAIMER,
  type ScamAnalysisResult,
  type ScamCategory,
  type WarningSign,
  type WarningSignType,
} from "@/types/scam";

/**
 * Offline heuristic analysis used when LOVABLE_API_KEY is not configured.
 * Must never be presented as a real AI result — callers set isDemo: true.
 * Output is always in English.
 */

const DEMO_DISCLAIMER =
  "DEMO ANALYSIS ONLY — the AI service is not connected. This result was produced by basic offline checks and is not a real AI assessment. Do not treat it as a verified scam verdict.";

type Pattern = {
  type: WarningSignType;
  re: RegExp;
  detail: string;
};

const PATTERNS: Pattern[] = [
  {
    type: "urgency",
    re: /\b(within\s+\d+\s*(minutes?|mins?|hours?)|act\s+now|immediately|urgent|expire|final\s+warning|suspend)/i,
    detail: "The message uses time pressure or urgency language.",
  },
  {
    type: "threat",
    re: /\b(suspend|block|legal\s+action|fine|account\s+will\s+be|arrest|police)/i,
    detail: "The message threatens consequences if you do not act.",
  },
  {
    type: "otp-request",
    re: /\b(otp|one[\s-]?time\s*(password|code|pin)|verification\s*code|share\s*(your\s*)?(pin|password|otp))/i,
    detail: "The message asks for an OTP, PIN or password.",
  },
  {
    type: "payment-demand",
    re: /\b(send\s+money|transfer|pay\s+(now|fee|deposit)|processing\s+fee|upfront|deposit\s+required)/i,
    detail: "The message asks for a payment, fee or money transfer.",
  },
  {
    type: "impersonation",
    re: /\b(hbl|ubl|meezan|jazzcash|easypaisa|paypal|bank|federal\s+reserve|irs|support\s+team)\b/i,
    detail: "The message appears to impersonate a bank, brand or official body.",
  },
  {
    type: "too-good-to-be-true",
    re: /\b(you\s+(have\s+)?won|lottery|prize|guaranteed\s+(profit|return)|free\s+gift)/i,
    detail: "The message promises a prize, profit or reward that looks unrealistic.",
  },
  {
    type: "secrecy",
    re: /\b(don'?t\s+tell|keep\s+(this\s+)?secret|do\s+not\s+inform)/i,
    detail: "The message asks you to keep the matter secret.",
  },
  {
    type: "personal-information",
    re: /\b(cnic|passport|id\s*card|card\s*number|cvv|account\s*number|national\s*id)/i,
    detail: "The message asks for personal or financial identity details.",
  },
];

function pickScamType(text: string, signs: WarningSign[]): ScamCategory {
  const lower = text.toLowerCase();
  if (/\b(job|hiring|work\s*from\s*home|vacancy)\b/.test(lower)) return "fake-job";
  if (/\b(invest|crypto|trading|forex|profit)\b/.test(lower)) return "investment";
  if (/\b(won|lottery|prize|gift)\b/.test(lower)) return "prize";
  if (/\b(shop|order|delivery|discount|store)\b/.test(lower)) return "shopping";
  if (/\b(loan|credit)\b/.test(lower)) return "loan";
  if (signs.some((s) => s.type === "payment-demand")) return "advance-payment";
  if (/\b(bank|hbl|ubl|meezan|account)\b/.test(lower)) return "bank-scam";
  if (signs.some((s) => s.type === "otp-request" || s.type === "suspicious-link")) {
    return "phishing";
  }
  return "unknown";
}

function demoTexts(hasSigns: boolean, scamType: ScamCategory) {
  if (!hasSigns) {
    return {
      explanation:
        "In demo mode, no strong scam patterns were found in this message. This is not a real AI result.",
      scamReason:
        "Offline checks did not find clear warning signs such as urgency, OTP requests or suspicious links.",
      safeActions: [
        "Still do not click links until you verify the sender through an official channel.",
        "Run a real analysis once the AI service is connected.",
      ],
    };
  }
  return {
    explanation: `Demo mode flagged this message as resembling a ${scamType.replace(/-/g, " ")}. This was produced by basic offline rules — not a real AI analysis.`,
    scamReason:
      "The detected warning signs (such as urgency, OTP requests, payment demands or suspicious links) match common scam patterns.",
    safeActions: [
      "Do not open or click any link in this message.",
      "Do not share OTP codes, PINs or passwords with anyone.",
      "Verify the sender only through the organisation's official app, website or helpline.",
      "Run a real analysis once the AI service is connected.",
    ],
  };
}

/** Build a clearly labeled demo analysis from offline heuristics only. */
export function buildDemoAnalysis(text: string): ScamAnalysisResult {
  const linkChecks = analyseUrls(text);
  const warningSigns: WarningSign[] = [];

  for (const p of PATTERNS) {
    if (p.re.test(text)) {
      warningSigns.push({ type: p.type, detail: p.detail });
    }
  }

  const suspiciousLinks = linkChecks
    .filter((c) => c.findings.length > 0)
    .map((c) => ({
      displayedLink: c.url,
      concern: c.findings.map((f) => f.note).join(" "),
    }));

  if (
    suspiciousLinks.length > 0 &&
    !warningSigns.some((w) => w.type === "suspicious-link")
  ) {
    warningSigns.push({
      type: "suspicious-link",
      detail: "The message contains suspicious or shortened links.",
    });
  }

  const scamType = pickScamType(text, warningSigns);
  const hasSigns = warningSigns.length > 0 || suspiciousLinks.length > 0;
  const texts = demoTexts(hasSigns, scamType);

  let riskLevel: ScamAnalysisResult["riskLevel"] = "low";
  let riskScore = 18;
  if (warningSigns.length >= 3 || suspiciousLinks.length >= 2) {
    riskLevel = "high";
    riskScore = 82;
  } else if (hasSigns) {
    riskLevel = "medium";
    riskScore = 55;
  }

  return {
    riskLevel,
    riskScore,
    scamType,
    explanation: texts.explanation,
    scamReason: texts.scamReason,
    warningSigns,
    suspiciousRequests: warningSigns
      .filter((w) =>
        ["otp-request", "payment-demand", "personal-information"].includes(w.type),
      )
      .map((w) => w.detail),
    suspiciousLinks,
    linkChecks,
    safeActions: texts.safeActions,
    confidence: 0,
    isReadable: true,
    isDemo: true,
    disclaimer: `${DEMO_DISCLAIMER} ${DEFAULT_DISCLAIMER}`,
  };
}
