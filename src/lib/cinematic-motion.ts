/** Shared motion preferences — client-only. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

/** Depth multiplier for parallax — lower on mobile for stability. */
export function depthScale(): number {
  if (prefersReducedMotion()) return 0;
  if (isMobileViewport()) return 0.45;
  return 1;
}

export const CINEMATIC_EASE = {
  enter: "power3.out",
  exit: "power2.inOut",
  scrub: "none",
} as const;
