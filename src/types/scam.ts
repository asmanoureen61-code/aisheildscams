export type RiskLevel = "low" | "medium" | "high" | "uncertain";

export const SCAM_CATEGORIES = [
  "bank-scam",
  "phishing",
  "fake-job",
  "investment",
  "prize",
  "shopping",
  "loan",
  "advance-payment",
  "unknown",
] as const;

export type ScamCategory = (typeof SCAM_CATEGORIES)[number];

export const SCAM_CATEGORY_LABELS: Record<ScamCategory, string> = {
  "bank-scam": "Bank Scam",
  phishing: "Phishing",
  "fake-job": "Fake Job",
  investment: "Investment Scam",
  prize: "Prize Scam",
  shopping: "Shopping Scam",
  loan: "Loan Scam",
  "advance-payment": "Advance Payment Scam",
  unknown: "No clear category detected",
};

export type InputType = "text" | "image";

export interface SuspiciousLink {
  displayedLink: string;
  concern: string;
}

export const WARNING_SIGN_TYPES = [
  "urgency",
  "threat",
  "otp-request",
  "payment-demand",
  "suspicious-link",
  "impersonation",
  "personal-information",
  "too-good-to-be-true",
  "secrecy",
  "other",
] as const;

export type WarningSignType = (typeof WARNING_SIGN_TYPES)[number];

export interface WarningSign {
  type: WarningSignType;
  /** Short plain-language explanation of what was detected. */
  detail: string;
}

export const WARNING_SIGN_LABELS: Record<WarningSignType, string> = {
  urgency: "Urgency",
  threat: "Threat",
  "otp-request": "OTP request",
  "payment-demand": "Payment demand",
  "suspicious-link": "Suspicious link",
  impersonation: "Impersonation",
  "personal-information": "Personal information request",
  "too-good-to-be-true": "Too good to be true",
  secrecy: "Secrecy pressure",
  other: "Warning sign",
};

export interface ScamAnalysisResult {
  riskLevel: RiskLevel;
  /** 0-100: how strongly the content matches known scam patterns. */
  riskScore: number;
  scamType: ScamCategory;
  explanation: string;
  /** Short explanation of why the content may be a scam. */
  scamReason: string;
  warningSigns: WarningSign[];
  suspiciousRequests: string[];
  suspiciousLinks: SuspiciousLink[];
  /** Deterministic offline URL checks, computed without opening any link. */
  linkChecks: UrlCheck[];
  safeActions: string[];
  confidence: number;
  isReadable: boolean;
  /** True when AI is not connected and this is offline demo output only. */
  isDemo: boolean;
  disclaimer: string;
}

export type UrlCheckFindingKind =
  | "shortener"
  | "lookalike"
  | "ip-address"
  | "punycode"
  | "suspicious-tld"
  | "at-symbol"
  | "insecure-http"
  | "many-subdomains"
  | "digit-substitution";

export interface UrlCheckFinding {
  kind: UrlCheckFindingKind;
  note: string;
}

/** Offline check of a URL found in the submitted text. Links are never opened. */
export interface UrlCheck {
  url: string;
  findings: UrlCheckFinding[];
}

export interface ExtractedScreenshotText {
  extractedText: string;
  isReadable: boolean;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  error: null;
}

export interface ApiFailure {
  success: false;
  data: null;
  error: { code: string; message: string };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  uncertain: "Unable to Confirm",
};

export const DEFAULT_DISCLAIMER =
  "Scam Detector AI provides general safety guidance. A low-risk result does not prove that a message is safe. Do not share passwords, OTP codes or financial information. Verify important messages through official channels.";
