import { useEffect, type RefObject } from "react";
import gsap from "gsap";

import { CINEMATIC_EASE, depthScale, prefersReducedMotion } from "@/lib/cinematic-motion";
import { getLetterFlight } from "@/lib/hero-letter-flight";

/** 3D film-title letter fly-in + camera push + content reveal. */
export function useHeroTitleIntro(
  sectionRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const depth = depthScale();
    const letters = gsap.utils.toArray<HTMLElement>("[data-hero-letter]", section);
    if (letters.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-hero-reveal]", { autoAlpha: 0 });
      gsap.set(letters, { transformOrigin: "50% 50% 0px", autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: CINEMATIC_EASE.enter },
        onComplete: () => {
          section.classList.add("hero-intro--complete");
          gsap.set(letters, { clearProps: "willChange,filter" });
        },
      });

      /* Camera push + atmosphere */
      tl.fromTo(
        "[data-hero-camera]",
        {
          z: -280 * depth,
          scale: 1.12,
          rotateX: 7,
          transformOrigin: "50% 42%",
        },
        { z: 0, scale: 1, rotateX: 0, duration: 2.35, ease: "power2.out" },
        0,
      );

      tl.fromTo(
        "[data-hero-bg-rig]",
        { z: -360 * depth, opacity: 0.2, scale: 1.15 },
        { z: 0, opacity: 1, scale: 1, duration: 2.1, ease: "power2.out" },
        0,
      );

      /* Individual letters — fly through depth toward final position */
      letters.forEach((letter, i) => {
        const f = getLetterFlight(i, depth);
        tl.fromTo(
          letter,
          {
            x: f.x,
            y: f.y,
            z: f.z,
            rotateX: f.rotateX,
            rotateY: f.rotateY,
            rotateZ: f.rotateZ,
            scale: f.scale,
            opacity: 0,
            filter: `blur(${f.blur}px)`,
          },
          {
            x: 0,
            y: 0,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            autoAlpha: 1,
            duration: f.duration,
            ease: "power3.out",
          },
          0.12 + i * 0.032,
        );
      });

      const lettersEnd = 0.12 + letters.length * 0.032 + 1.05;

      /* Supporting copy + CTA after headline locks */
      tl.fromTo(
        "[data-hero-lead]",
        { y: 28, z: -50 * depth, opacity: 0, filter: "blur(6px)" },
        { y: 0, z: 0, opacity: 1, filter: "blur(0px)", autoAlpha: 1, duration: 0.95 },
        lettersEnd - 0.15,
      );

      tl.fromTo(
        "[data-hero-cta] > *",
        { y: 22, z: -35 * depth, opacity: 0, scale: 0.96 },
        {
          y: 0,
          z: 0,
          opacity: 1,
          scale: 1,
          autoAlpha: 1,
          stagger: 0.1,
          duration: 0.75,
        },
        lettersEnd + 0.08,
      );

      tl.fromTo(
        "[data-hero-visual]",
        {
          y: 40,
          z: -80 * depth,
          rotateY: -12,
          rotateX: 6,
          scale: 0.92,
          opacity: 0,
          filter: "blur(8px)",
        },
        {
          y: 0,
          z: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          autoAlpha: 1,
          duration: 1.1,
          ease: "power3.out",
        },
        lettersEnd + 0.05,
      );
    }, section);

    return () => {
      section.classList.remove("hero-intro--complete");
      ctx.revert();
    };
  }, [sectionRef, enabled]);
}
