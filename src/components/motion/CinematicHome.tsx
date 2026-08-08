import { useEffect, useRef, useState, type ReactNode } from "react";

import { prefersReducedMotion } from "@/lib/cinematic-motion";
import { useHomeCinematic, useSmoothScroll } from "@/hooks/useHomeCinematic";

type Props = {
  children: ReactNode;
};

/** Enables Lenis smooth scroll + GSAP ScrollTrigger choreography for the homepage. */
export function CinematicHome({ children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [motionOn, setMotionOn] = useState(false);

  useEffect(() => {
    setMotionOn(!prefersReducedMotion());
  }, []);

  useSmoothScroll(motionOn);
  useHomeCinematic(rootRef, motionOn);

  return (
    <div ref={rootRef} className="cinematic-page">
      {children}
    </div>
  );
}
