import { useEffect, useRef, useState, type RefObject } from "react";
import { ShieldCheck } from "lucide-react";

import { prefersReducedMotion } from "@/lib/cinematic-motion";
import { useHeroScanCard } from "@/hooks/useHeroScanCard";

const WARNINGS = [
  { label: "Urgency:", highlight: '"verify within 30 minutes"' },
  { label: "Asks for", highlight: "OTP code" },
  { label: "Suspicious", highlight: "lookalike domain" },
  { label: "Threatens", highlight: "account suspension" },
] as const;

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
};

export function HeroScanCard({ sectionRef }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [motionOn, setMotionOn] = useState(false);

  useEffect(() => {
    setMotionOn(!prefersReducedMotion());
  }, []);

  useHeroScanCard(cardRef, sectionRef, motionOn);

  return (
    <div
      ref={cardRef}
      data-hero-scan-card
      className="hero-scan-card relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-4 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-6"
    >
      <div
        data-scan-line
        className="hero-scan-line pointer-events-none absolute left-0 right-0 z-20 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.45)]"
        aria-hidden
      />

      <div className="relative z-10 flex items-center gap-3 border-b border-white/10 pb-4">
        <ShieldCheck className="h-6 w-6 text-cyan-300" aria-hidden />
        <div>
          <div className="text-sm font-semibold">Sample analysis</div>
          <div className="text-xs text-white/55">Bank impersonation</div>
        </div>
        <span
          data-scan-risk
          className="ml-auto rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-red-200/90"
        >
          High Risk
        </span>
      </div>

      <ul className="relative z-10 mt-4 space-y-3 text-sm text-white/75">
        {WARNINGS.map((w, i) => (
          <li key={w.highlight} data-scan-warning={i} className="flex flex-wrap gap-1">
            <span>• {w.label}</span>
            <span
              data-scan-highlight
              className="hero-scan-highlight rounded-sm px-0.5 text-cyan-100"
            >
              {w.highlight}
            </span>
          </li>
        ))}
      </ul>

      <div className="relative z-10 mt-5 min-h-[3.25rem] rounded-lg border border-white/10 bg-black/30 p-3 text-xs leading-relaxed text-white/70">
        {motionOn ? (
          <>
            <span data-scan-typed />
            <span data-scan-cursor className="ml-0.5 inline-block text-cyan-300/80">
              |
            </span>
          </>
        ) : (
          <span>
            Recommended: Do not share the OTP. Verify only through your bank&apos;s official app.
          </span>
        )}
      </div>
    </div>
  );
}
