/** Seeded pseudo-random — stable per index. */
export function seedRand(index: number, salt = 0): number {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export type MgParticle = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  alpha: number;
  blue: boolean;
};

export type MgLine = {
  x: number;
  y: number;
  z: number;
  angle: number;
  length: number;
  speed: number;
  phase: number;
};

export type MgStreak = {
  x: number;
  y: number;
  z: number;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
};

export type MgState = {
  particles: MgParticle[];
  lines: MgLine[];
  streaks: MgStreak[];
  time: number;
  width: number;
  height: number;
  mouseX: number;
  mouseY: number;
  scrollY: number;
};

export function createMgState(width: number, height: number, density: number): MgState {
  const particleCount = Math.floor(55 * density);
  const lineCount = Math.floor(8 * density);

  const particles: MgParticle[] = Array.from({ length: particleCount }, (_, i) => {
    const r = seedRand(i, 1);
    const z = 80 + seedRand(i, 2) * 420;
    return {
      x: (seedRand(i, 3) - 0.5) * width * 1.4,
      y: (seedRand(i, 4) - 0.5) * height * 1.4,
      z,
      vx: (seedRand(i, 5) - 0.5) * 0.35,
      vy: (seedRand(i, 6) - 0.5) * 0.28,
      vz: (seedRand(i, 7) - 0.5) * 0.08,
      size: 0.6 + r * 2.2,
      alpha: 0.15 + seedRand(i, 8) * 0.55,
      blue: seedRand(i, 9) > 0.55,
    };
  });

  const lines: MgLine[] = Array.from({ length: lineCount }, (_, i) => ({
    x: (seedRand(i, 10) - 0.5) * width,
    y: (seedRand(i, 11) - 0.5) * height,
    z: 120 + seedRand(i, 12) * 300,
    angle: seedRand(i, 13) * Math.PI * 2,
    length: 60 + seedRand(i, 14) * 140,
    speed: 0.15 + seedRand(i, 15) * 0.35,
    phase: seedRand(i, 16) * Math.PI * 2,
  }));

  return {
    particles,
    lines,
    streaks: [],
    time: 0,
    width,
    height,
    mouseX: 0,
    mouseY: 0,
    scrollY: 0,
  };
}

function project(
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  focal: number,
  camX: number,
  camY: number,
  camZ: number,
) {
  const scale = focal / (focal + z + camZ);
  return {
    sx: w * 0.5 + (x - camX) * scale,
    sy: h * 0.5 + (y - camY) * scale,
    scale,
  };
}

export function tickMgState(state: MgState, dt: number, density: number) {
  state.time += dt;
  const { width, height } = state;
  const camDriftX = Math.sin(state.time * 0.12) * 18 + state.mouseX * 28;
  const camDriftY = Math.cos(state.time * 0.09) * 12 + state.mouseY * 18;
  const camZ = Math.sin(state.time * 0.06) * 40 + state.scrollY * 0.15;

  for (const p of state.particles) {
    p.x += p.vx * (1 + p.z * 0.002);
    p.y += p.vy * (1 + p.z * 0.002);
    p.z += p.vz;
    if (p.z < 40) p.z = 420;
    if (p.z > 480) p.z = 60;
    if (Math.abs(p.x) > width * 0.9) p.vx *= -1;
    if (Math.abs(p.y) > height * 0.9) p.vy *= -1;
  }

  if (state.streaks.length < 3 * density && Math.random() < 0.008 * density) {
    state.streaks.push({
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      z: 100 + Math.random() * 250,
      angle: Math.random() * Math.PI * 2,
      speed: 80 + Math.random() * 120,
      life: 0,
      maxLife: 1.2 + Math.random() * 1.8,
    });
  }

  state.streaks = state.streaks.filter((s) => {
    s.life += dt;
    s.x += Math.cos(s.angle) * s.speed * dt;
    s.y += Math.sin(s.angle) * s.speed * dt;
    return s.life < s.maxLife;
  });

  return { camDriftX, camDriftY, camZ };
}

export function drawMgFrame(
  ctx: CanvasRenderingContext2D,
  state: MgState,
  camDriftX: number,
  camDriftY: number,
  camZ: number,
) {
  const { width, height, particles, lines, streaks } = state;
  const focal = 520;

  ctx.clearRect(0, 0, width, height);

  /* Soft blue radial washes */
  const g1 = ctx.createRadialGradient(
    width * 0.72 + camDriftX * 0.3,
    height * 0.22 + camDriftY * 0.3,
    0,
    width * 0.72,
    height * 0.22,
    width * 0.45,
  );
  g1.addColorStop(0, "rgba(34,211,238,0.11)");
  g1.addColorStop(1, "rgba(34,211,238,0)");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, width, height);

  const g2 = ctx.createRadialGradient(
    width * 0.15 - camDriftX * 0.2,
    height * 0.78,
    0,
    width * 0.15,
    height * 0.78,
    width * 0.35,
  );
  g2.addColorStop(0, "rgba(6,182,212,0.07)");
  g2.addColorStop(1, "rgba(6,182,212,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, width, height);

  /* Glowing lines — back to front */
  const sortedLines = [...lines].sort((a, b) => b.z - a.z);
  for (const line of sortedLines) {
    const wobble = Math.sin(state.time * line.speed + line.phase) * 0.4;
    const len = line.length * (1 + wobble * 0.15);
    const { sx, sy, scale } = project(
      line.x,
      line.y,
      line.z,
      width,
      height,
      focal,
      camDriftX,
      camDriftY,
      camZ,
    );
    const ex = sx + Math.cos(line.angle) * len * scale;
    const ey = sy + Math.sin(line.angle) * len * scale;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = `rgba(255,255,255,${0.06 + scale * 0.12})`;
    ctx.lineWidth = Math.max(0.5, scale * 1.2);
    ctx.shadowColor = "rgba(34,211,238,0.35)";
    ctx.shadowBlur = 8 * scale;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  /* Light streaks */
  for (const s of streaks) {
    const t = 1 - s.life / s.maxLife;
    const { sx, sy, scale } = project(
      s.x,
      s.y,
      s.z,
      width,
      height,
      focal,
      camDriftX,
      camDriftY,
      camZ,
    );
    const len = 90 * scale * t;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.cos(s.angle) * len, sy + Math.sin(s.angle) * len);
    const grad = ctx.createLinearGradient(sx, sy, sx + Math.cos(s.angle) * len, sy + Math.sin(s.angle) * len);
    grad.addColorStop(0, `rgba(255,255,255,${0.35 * t})`);
    grad.addColorStop(1, "rgba(34,211,238,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
  }

  /* Particles */
  const sorted = [...particles].sort((a, b) => b.z - a.z);
  for (const p of sorted) {
    const { sx, sy, scale } = project(
      p.x,
      p.y,
      p.z,
      width,
      height,
      focal,
      camDriftX,
      camDriftY,
      camZ,
    );
    const r = p.size * scale;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    if (p.blue) {
      ctx.fillStyle = `rgba(34,211,238,${p.alpha * scale * 0.75})`;
    } else {
      ctx.fillStyle = `rgba(255,255,255,${p.alpha * scale * 0.85})`;
    }
    ctx.fill();
  }
}

export function getMotionDensity(): number {
  if (typeof window === "undefined") return 1;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  if (coarse && narrow) return 0.45;
  if (narrow) return 0.65;
  return 1;
}
