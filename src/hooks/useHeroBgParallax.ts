import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { depthScale, prefersReducedMotion } from "@/lib/cinematic-motion";

gsap.registerPlugin(ScrollTrigger);

/** Mouse + scroll parallax for hero motion-graphics layers. */
export function useHeroBgParallax(
  sectionRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const depth = depthScale();
    const quickLayers = gsap.utils
      .toArray<HTMLElement>("[data-hero-bg-layer]", section)
      .map((el) => {
        const layer = Number(el.dataset.heroBgLayer ?? 1);
        return {
          el,
          layer,
          xTo: gsap.quickTo(el, "x", { duration: 1.1, ease: "power2.out" }),
          yTo: gsap.quickTo(el, "y", { duration: 1.1, ease: "power2.out" }),
          factor: 8 + layer * 10,
        };
      });

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      for (const { xTo, yTo, factor } of quickLayers) {
        xTo(nx * factor * depth);
        yTo(ny * factor * 0.65 * depth);
      }
    };

    section.addEventListener("mousemove", onMove);

    gsap.utils.toArray<HTMLElement>("[data-hero-shape]", section).forEach((shape, i) => {
      gsap.to(shape, {
        rotateZ: i % 2 === 0 ? 360 : -360,
        duration: 48 + i * 8,
        repeat: -1,
        ease: "none",
      });
      gsap.to(shape, {
        y: `+=${12 + i * 4}`,
        duration: 6 + i * 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    const scrollTween = gsap.to("[data-hero-bg-rig]", {
      y: -80 * depth,
      scale: 1.06,
      opacity: 0.55,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });

    const sway = gsap.timeline({ repeat: -1, yoyo: true });
    sway.to("[data-hero-bg-rig]", {
      rotateX: 2,
      rotateY: -1.5,
      duration: 14,
      ease: "sine.inOut",
      transformOrigin: "50% 50%",
    });

    return () => {
      section.removeEventListener("mousemove", onMove);
      scrollTween.kill();
      sway.kill();
    };
  }, [sectionRef, enabled]);
}
