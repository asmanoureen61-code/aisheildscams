import { useEffect, useRef, useState } from "react";

import { prefersReducedMotion } from "@/lib/cinematic-motion";
import {
  createMgState,
  drawMgFrame,
  getMotionDensity,
  tickMgState,
  type MgState,
} from "@/lib/hero-motion-graphics";

type Props = {
  className?: string;
};

export function HeroMotionCanvas({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<MgState | null>(null);
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(true);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const density = getMotionDensity();
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stateRef.current = createMgState(w, h, density);
    };

    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);

    let last = performance.now();
    const section = canvas.closest("[data-hero-intro]");

    const onMove = (e: MouseEvent) => {
      if (!stateRef.current || !section) return;
      const rect = section.getBoundingClientRect();
      stateRef.current.mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      stateRef.current.mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    };
    section?.addEventListener("mousemove", onMove);

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (!visibleRef.current || !stateRef.current) return;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const state = stateRef.current;
      if (section) {
        state.scrollY = Math.max(0, -section.getBoundingClientRect().top);
      }
      const cam = tickMgState(state, dt, density);
      drawMgFrame(ctx, state, cam.camDriftX, cam.camDriftY, cam.camZ);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      section?.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        className={className}
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(59,130,246,0.15), transparent 60%), #000000",
        }}
      />
    );
  }

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
