export const FPS = 30;
export const sec = (s) => Math.round(s * FPS);

export const C = {
  bg: "#0a0e16",
  panel: "#111827",
  border: "#1f2937",
  text: "#e5e7eb",
  dim: "#6b7280",
  cyan: "#22d3ee",
  green: "#4ade80",
  amber: "#fbbf24",
  pink: "#f472b6",
};

export const MONO = 'Menlo, "SF Mono", Monaco, monospace';
export const SANS = '-apple-system, "SF Pro Display", "Helvetica Neue", Arial, sans-serif';

// Characters of `text` visible at `frame`, typing from `start` at `cps` characters per second.
export const typed = (text, frame, start, cps = 24) =>
  text.slice(0, Math.max(0, Math.floor(((frame - start) / FPS) * cps)));
