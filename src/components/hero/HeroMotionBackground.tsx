import { HeroMotionCanvas } from "@/components/hero/HeroMotionCanvas";

/** Layered motion-graphics background: canvas + 3D geometric depth planes. */
export function HeroMotionBackground() {
  return (
    <div
      data-hero-bg-rig
      className="hero-mg-rig pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <HeroMotionCanvas className="hero-mg-canvas absolute inset-0 h-full w-full" />

      <div
        data-hero-bg-layer="1"
        className="hero-mg-layer absolute inset-0"
        style={{ transform: "translateZ(-120px)" }}
      >
        <div className="absolute -left-20 top-[8%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/[0.06] blur-[100px]" />
        <div className="absolute -right-16 bottom-[5%] h-80 w-80 rounded-full bg-cyan-400/[0.05] blur-[90px]" />
      </div>

      <div
        data-hero-bg-layer="2"
        className="hero-mg-layer absolute inset-0"
        style={{ transform: "translateZ(-60px)" }}
      >
        <div
          data-hero-shape
          className="hero-mg-shape absolute left-[12%] top-[22%] h-32 w-32 rounded-full border border-white/[0.08]"
        />
        <div
          data-hero-shape
          className="hero-mg-shape absolute right-[18%] top-[38%] h-24 w-24 rotate-45 border border-cyan-400/15 bg-cyan-500/[0.03]"
        />
        <div
          data-hero-shape
          className="hero-mg-shape absolute left-[55%] bottom-[18%] h-40 w-40 rounded-full border border-white/[0.06]"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        />
      </div>

      <div
        data-hero-bg-layer="3"
        className="hero-mg-layer absolute inset-0"
        style={{ transform: "translateZ(-20px)" }}
      >
        <div
          data-hero-shape
          className="hero-mg-shape absolute right-[8%] top-[12%] h-48 w-48 rounded-full border border-cyan-300/10 shadow-[0_0_40px_rgba(34,211,238,0.06)]"
        />
        <div className="absolute left-[6%] top-[55%] h-px w-[40%] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute right-[10%] bottom-[30%] h-px w-[35%] rotate-[-18deg] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
      <div className="hero-mg-noise absolute inset-0 opacity-[0.035]" />
    </div>
  );
}
