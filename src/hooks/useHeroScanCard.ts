import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

import { prefersReducedMotion } from "@/lib/cinematic-motion";

gsap.registerPlugin(TextPlugin);

const RECOMMENDATION =
  "Recommended: Do not share the OTP. Verify only through your bank's official app.";

/** Live AI scan sequence on the hero sample card. */
export function useHeroScanCard(
  cardRef: RefObject<HTMLElement | null>,
  sectionRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const card = cardRef.current;
    const section = sectionRef.current;
    if (!card || !section || prefersReducedMotion()) return;

    let started = false;
    let ctx: gsap.Context | null = null;

    const runScan = () => {
      if (started) return;
      started = true;

      ctx = gsap.context(() => {
        gsap.set("[data-scan-warning]", { autoAlpha: 0, x: 12 });
        gsap.set("[data-scan-risk]", { autoAlpha: 0, scale: 0.88 });
        gsap.set("[data-scan-line]", { autoAlpha: 0, top: "0%" });
        gsap.set("[data-scan-typed]", { text: "" });
        gsap.set("[data-scan-cursor]", { autoAlpha: 0 });
        gsap.set("[data-scan-highlight]", { backgroundSize: "0% 100%" });

        const tl = gsap.timeline({ delay: 0.35 });

        tl.to("[data-scan-line]", { autoAlpha: 1, duration: 0.2 }, 0)
          .to("[data-scan-line]", {
            top: "100%",
            duration: 2.1,
            ease: "power1.inOut",
          })
          .to("[data-scan-line]", { autoAlpha: 0, duration: 0.35 }, "-=0.25");

        tl.to(
          "[data-scan-warning]",
          {
            autoAlpha: 1,
            x: 0,
            stagger: 0.22,
            duration: 0.55,
            ease: "power2.out",
          },
          0.55,
        );

        tl.to(
          "[data-scan-highlight]",
          {
            backgroundSize: "100% 100%",
            stagger: 0.18,
            duration: 0.45,
            ease: "power2.out",
          },
          0.75,
        );

        tl.to(
          "[data-scan-risk]",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.65,
            ease: "back.out(1.4)",
          },
          1.35,
        );

        const typedEl = card.querySelector("[data-scan-typed]");
        if (typedEl) {
          tl.to(
            typedEl,
            {
              duration: 2.4,
              ease: "none",
              text: RECOMMENDATION,
            },
            1.55,
          );
        }

        tl.to("[data-scan-cursor]", { autoAlpha: 1, duration: 0.15 }, 1.55)
          .to(
            "[data-scan-cursor]",
            { opacity: 0, duration: 0.35, repeat: 5, yoyo: true },
            1.55,
          )
          .to("[data-scan-cursor]", { autoAlpha: 0, duration: 0.2 }, "-=0.1");
      }, card);
    };

    if (section.classList.contains("hero-intro--complete")) {
      runScan();
    }

    const observer = new MutationObserver(() => {
      if (section.classList.contains("hero-intro--complete")) {
        runScan();
        observer.disconnect();
      }
    });
    observer.observe(section, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      ctx?.revert();
    };
  }, [cardRef, sectionRef, enabled]);
}
