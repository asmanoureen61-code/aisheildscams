/** Deterministic per-letter flight vectors — stable across reloads, varied per character. */
export type LetterFlight = {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
  blur: number;
  duration: number;
};

export function getLetterFlight(index: number, depth = 1): LetterFlight {
  const seed = (index * 13 + 5) % 97;
  const side = index % 2 === 0 ? 1 : -1;
  const lane = index % 5;

  const x = side * (60 + (seed % 100)) * depth;
  const y = (-40 + (seed % 130) - lane * 12) * depth;
  const z =
    lane === 0 || lane === 2
      ? (320 + seed * 4) * depth
      : (-220 - seed * 3) * depth;

  return {
    x,
    y,
    z,
    rotateX: side * (8 + (seed % 16)),
    rotateY: -side * (10 + (seed % 20)),
    rotateZ: side * (3 + (seed % 7)),
    scale: lane === 0 ? 1.65 : lane === 1 ? 0.55 : 1 + (seed % 10) / 20,
    blur: Math.min(10, 3 + (seed % 8)),
    duration: 1.05 + (index % 4) * 0.12,
  };
}

export function getWordDelay(wordIndex: number, letterIndex: number): number {
  return wordIndex * 0.06 + letterIndex * 0.034;
}
