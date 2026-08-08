import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import {
  CINEMATIC_EASE,
  depthScale,
  prefersReducedMotion,
} from "@/lib/cinematic-motion";

gsap.registerPlugin(ScrollTrigger);

/** Smooth scroll + ScrollTrigger sync. Returns cleanup via ref callback pattern. */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.35,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    document.documentElement.classList.add("lenis", "lenis-smooth");

    return () => {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.clearScrollMemory();
    };
  }, [enabled]);
}

/** Homepage cinematic 3D scroll choreography. */
export function useHomeCinematic(
  rootRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const scale = depthScale();

    const ctx = gsap.context(() => {
      /* ── Section headers — line reveal ── */
      gsap.utils.toArray<HTMLElement>("[data-cine-reveal='heading']").forEach((el) => {
        gsap.from(el, {
          y: 48,
          z: -70 * scale,
          opacity: 0,
          rotateX: 12,
          transformOrigin: "50% 100%",
          ease: CINEMATIC_EASE.enter,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "top 55%",
            scrub: 0.45,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-cine-reveal='text']").forEach((el) => {
        gsap.from(el, {
          y: 32,
          z: -40 * scale,
          opacity: 0,
          ease: CINEMATIC_EASE.enter,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "top 62%",
            scrub: 0.4,
          },
        });
      });

      /* ── Scam cards — scroll reveal + hover depth ── */
      gsap.from("[data-cine-card='scam']", {
        y: 72,
        z: -90 * scale,
        opacity: 0,
        rotateX: 8,
        scale: 0.94,
        stagger: 0.06,
        ease: CINEMATIC_EASE.enter,
        scrollTrigger: {
          trigger: "[data-cine-section='scams']",
          start: "top 78%",
          end: "top 35%",
          scrub: 0.55,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-cine-card='scam']").forEach((card) => {
        const onEnter = () => {
          gsap.to(card, {
            y: -6,
            z: 24,
            rotateX: 3,
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(15,23,42,0.12)",
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        const onLeave = () => {
          gsap.to(card, {
            y: 0,
            z: 0,
            rotateX: 0,
            scale: 1,
            boxShadow: "0 0 0 rgba(0,0,0,0)",
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        card.addEventListener("focusin", onEnter);
        card.addEventListener("focusout", onLeave);
      });

      /* ── How it works — stagger + step pulse ── */
      gsap.from("[data-cine-step]", {
        y: 64,
        z: -55 * scale,
        opacity: 0,
        rotateX: 10,
        scale: 0.95,
        stagger: 0.1,
        ease: CINEMATIC_EASE.enter,
        scrollTrigger: {
          trigger: "[data-cine-section='steps']",
          start: "top 78%",
          end: "top 38%",
          scrub: 0.55,
        },
      });

      gsap.from("[data-cine-step-icon]", {
        scale: 0.6,
        opacity: 0,
        stagger: 0.12,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: "[data-cine-section='steps']",
          start: "top 72%",
          end: "top 42%",
          scrub: 0.4,
        },
      });

      gsap.fromTo(
        "[data-cine-steps-line]",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-cine-section='steps']",
            start: "top 70%",
            end: "top 40%",
            scrub: 0.5,
          },
        },
      );

      /* Parallax the steps band background slightly */
      gsap.to("[data-cine-depth='steps-bg']", {
        y: -50 * scale,
        scrollTrigger: {
          trigger: "[data-cine-section='steps']",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      /* ── Privacy — layered parallax ── */
      gsap.from("[data-cine-depth='privacy-copy']", {
        x: -40 * scale,
        z: -50 * scale,
        opacity: 0,
        rotateY: 6,
        ease: CINEMATIC_EASE.enter,
        scrollTrigger: {
          trigger: "[data-cine-section='privacy']",
          start: "top 80%",
          end: "top 45%",
          scrub: 0.5,
        },
      });

      gsap.from("[data-cine-depth='privacy-panel']", {
        x: 50 * scale,
        z: -70 * scale,
        opacity: 0,
        rotateY: -8,
        boxShadow: "0 0 0 rgba(0,0,0,0)",
        ease: CINEMATIC_EASE.enter,
        scrollTrigger: {
          trigger: "[data-cine-section='privacy']",
          start: "top 78%",
          end: "top 42%",
          scrub: 0.55,
        },
      });

      gsap.to("[data-cine-depth='privacy-panel']", {
        boxShadow: "0 24px 48px rgba(15,23,42,0.08)",
        scrollTrigger: {
          trigger: "[data-cine-section='privacy']",
          start: "top 75%",
          end: "top 40%",
          scrub: 0.5,
        },
      });

      gsap.from("[data-privacy-item]", {
        x: 18,
        opacity: 0,
        stagger: 0.07,
        ease: CINEMATIC_EASE.enter,
        scrollTrigger: {
          trigger: "[data-cine-depth='privacy-panel']",
          start: "top 85%",
          end: "top 55%",
          scrub: 0.35,
        },
      });

      /* Section entrance borders */
      gsap.utils.toArray<HTMLElement>("[data-cine-section]").forEach((section) => {
        gsap.from(section, {
          opacity: 0.92,
          y: 24,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 75%",
            scrub: 0.35,
          },
        });
      });

    }, root);

    return () => {
      ctx.revert();
    };
  }, [rootRef, enabled]);
}
