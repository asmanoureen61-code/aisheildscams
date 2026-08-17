import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prefersReducedMotion } from "@/lib/cinematic-motion";
import { useHeroBgParallax } from "@/hooks/useHeroBgParallax";
import { useHeroTitleIntro } from "@/hooks/useHeroTitleIntro";
import { HeroMotionBackground } from "@/components/hero/HeroMotionBackground";
import { HeroScanCard } from "@/components/hero/HeroScanCard";

function LetterWords({
  text,
  lineIndex,
  accent = false,
  inline = false,
}: {
  text: string;
  lineIndex: number;
  accent?: boolean;
  inline?: boolean;
}) {
  const words = text.split(" ").filter((w) => w.length > 0);

  return (
    <span
      aria-hidden
      className={`${inline ? "hero-intro__line-part" : "hero-intro__line"} ${accent ? "text-sky-300" : "text-white"}`}
      data-hero-line={inline ? undefined : lineIndex}
    >
      {words.length === 0 ? (
        text.split("").map((char, ci) => (
          <span
            key={`${lineIndex}-s-${ci}`}
            data-hero-letter
            data-hero-line={lineIndex}
            className="hero-intro__letter"
          >
            {char}
          </span>
        ))
      ) : (
        words.map((word, wi) => (
          <span key={`${lineIndex}-${wi}`} className="hero-intro__word">
            {word.split("").map((char, ci) => (
              <span
                key={`${lineIndex}-${wi}-${ci}`}
                data-hero-letter
                data-hero-line={lineIndex}
                className="hero-intro__letter"
              >
                {char}
              </span>
            ))}
            {wi < words.length - 1 ? (
              <span data-hero-letter data-hero-line={lineIndex} className="hero-intro__letter">
                {"\u00A0"}
              </span>
            ) : null}
          </span>
        ))
      )}
      {words.length > 0 && text.endsWith(" ") ? (
        <span data-hero-letter data-hero-line={lineIndex} className="hero-intro__letter">
          {"\u00A0"}
        </span>
      ) : null}
    </span>
  );
}

export function HeroIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [motionOn, setMotionOn] = useState(false);

  useEffect(() => {
    setMotionOn(!prefersReducedMotion());
  }, []);

  useHeroTitleIntro(sectionRef, motionOn);
  useHeroBgParallax(sectionRef, motionOn);

  const staticHeadline = "Check Before You Click Pay or Share";

  return (
    <section
      ref={sectionRef}
      data-hero-intro
      className="hero-cinematic hero-intro hero-motion relative bg-black text-white max-md:overflow-x-hidden md:min-h-[92dvh] md:overflow-hidden"
    >
      <HeroMotionBackground />

      <div
        data-hero-camera
        className="hero-intro__camera hero-cinematic__content relative z-10 flex max-md:py-10 max-md:pb-12 md:min-h-[92dvh] md:items-end md:pb-[14vh]"
      >
        <div
          data-hero-atmosphere
          className="pointer-events-none absolute inset-0 opacity-0"
          aria-hidden
        />

        <div className="container-page grid w-full gap-8 max-md:gap-6 md:grid-cols-2 md:items-end md:gap-14">
          <div className="hero-intro__copy max-md:pt-2 md:pt-0">
            <h1
              className="hero-cinematic__title font-bold"
              aria-label={staticHeadline}
            >
              {motionOn ? (
                <>
                  <span className="sr-only">{staticHeadline}</span>
                  <span className="hero-intro__line" data-hero-line={1}>
                    <LetterWords text="Check Before You " lineIndex={1} inline />
                    <LetterWords text="Click" lineIndex={1} accent inline />
                  </span>
                  <LetterWords text="Pay or Share" lineIndex={2} accent />
                </>
              ) : (
                <>
                  Check Before You <span className="text-sky-300">Click</span>
                  <br />
                  <span className="text-sky-300">Pay or Share</span>
                </>
              )}
            </h1>

            <p
              data-hero-lead
              data-hero-reveal
              className="mt-6 max-w-xl text-base text-white/75 sm:text-lg"
            >
              Paste a suspicious message or upload a screenshot. Scam Detector AI will identify
              warning signs and explain safe next steps in clear English.
            </p>

            <div data-hero-cta data-hero-reveal className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="hero-cinematic__btn border-0 bg-white text-black shadow-[0_8px_32px_rgba(255,255,255,0.12)] transition-transform duration-200 hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98]"
              >
                <Link to="/analyse">
                  Check a Message <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/[0.04] text-white backdrop-blur-sm transition-transform duration-200 hover:scale-[1.03] hover:border-white/40 hover:bg-white/[0.08] active:scale-[0.98]"
              >
                <Link to="/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>

          <div
            data-hero-visual
            data-hero-reveal
            className="hero-intro__visual relative w-full max-md:max-w-full md:mt-0"
          >
            <HeroScanCard sectionRef={sectionRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
