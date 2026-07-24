export type RiskLevel = "low" | "medium" | "high" | "uncertain";

export type Language = "simple-english" | "roman-urdu";

export type InputType = "text" | "image";

export interface SuspiciousLink {
  displayedLink: string;
  concern: string;
}

export interface ScamAnalysisResult {
  riskLevel: RiskLevel;
  scamCategory: string;
  summary: string;
  warningSigns: string[];
  suspiciousRequests: string[];
  suspiciousLinks: SuspiciousLink[];
  recommendedActions: string[];
  confidence: number;
  isReadable: boolean;
  disclaimer: string;
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
  "ScamShield AI provides general safety guidance. A low-risk result does not prove that a message is safe. Do not share passwords, OTP codes or financial information. Verify important messages through official channels.";
