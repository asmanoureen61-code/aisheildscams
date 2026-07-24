import { AlertTriangle, ShieldAlert, ShieldCheck, HelpCircle } from "lucide-react";
import type { RiskLevel } from "@/types/scam";
import { RISK_LABELS } from "@/types/scam";
import { cn } from "@/lib/utils";

const ICON: Record<RiskLevel, typeof ShieldCheck> = {
  low: ShieldCheck,
  medium: AlertTriangle,
  high: ShieldAlert,
  uncertain: HelpCircle,
};

const CLASSES: Record<RiskLevel, string> = {
  low: "bg-risk-low text-risk-low-foreground",
  medium: "bg-risk-medium text-risk-medium-foreground",
  high: "bg-risk-high text-risk-high-foreground",
  uncertain: "bg-risk-uncertain text-risk-uncertain-foreground",
};

export function RiskBadge({
  level,
  size = "md",
}: {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = ICON[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-medium",
        CLASSES[level],
        size === "sm" && "px-2.5 py-1 text-xs",
        size === "md" && "px-3 py-1.5 text-sm",
        size === "lg" && "px-4 py-2 text-base",
      )}
      aria-label={`Risk level: ${RISK_LABELS[level]}`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {RISK_LABELS[level]}
    </span>
  );
}
