import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONO, SANS, typed } from "./theme.js";

export const Scene = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(frame, [0, 10, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1300px 800px at 75% 0%, #15233f 0%, ${C.bg} 62%)`,
        fontFamily: SANS,
        color: C.text,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Appear = ({ at = 0, y = 24, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 200 } });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * y}px)`, ...style }}>{children}</div>;
};

export const Heading = ({ children, sub }) => (
  <div style={{ position: "absolute", top: 70, left: 100, right: 100 }}>
    <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -1 }}>{children}</div>
    {sub && <div style={{ fontSize: 28, color: C.dim, marginTop: 8 }}>{sub}</div>}
  </div>
);

export const Window = ({ title, width, children, style }) => (
  <div
    style={{
      width,
      background: C.panel,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 30px 80px rgba(0,0,0,.55)",
      ...style,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 18px",
        borderBottom: `1px solid ${C.border}`,
        background: "#0d1320",
      }}
    >
      {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
        <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
      ))}
      <span style={{ marginLeft: 12, color: C.dim, fontFamily: MONO, fontSize: 18 }}>{title}</span>
    </div>
    <div style={{ padding: 28 }}>{children}</div>
  </div>
);

const Cursor = ({ size }) => {
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        display: "inline-block",
        width: size * 0.55,
        height: size * 1.1,
        verticalAlign: "text-bottom",
        background: C.text,
        opacity: Math.floor(frame / 15) % 2 ? 0 : 0.9,
      }}
    />
  );
};

// lines: [{ at, segs: [{ t, color, at?, cps? }] }]. A line shows from `at`; each segment types from its own `at`.
export const Term = ({ lines, size = 24, minHeight }) => {
  const frame = useCurrentFrame();
  const visible = lines.filter((l) => frame >= l.at);
  return (
    <div style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.55, whiteSpace: "pre", minHeight }}>
      {visible.map((line, i) => (
        <div key={i} style={{ minHeight: size * 1.55 }}>
          {line.segs.map((s, j) => (
            <span key={j} style={{ color: s.color ?? C.text }}>
              {typed(s.t, frame, s.at ?? line.at, s.cps ?? 1000)}
            </span>
          ))}
          {i === visible.length - 1 && <Cursor size={size} />}
        </div>
      ))}
    </div>
  );
};

export const Code = ({ lines, highlight = [], size = 24 }) => (
  <div style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.6, whiteSpace: "pre" }}>
    {lines.map((l, i) => {
      const on = highlight.includes(i);
      const comment = l.trim().startsWith("//");
      return (
        <div
          key={i}
          style={{
            padding: "0 14px",
            marginLeft: -14,
            borderLeft: `4px solid ${on ? C.cyan : "transparent"}`,
            background: on ? "rgba(34,211,238,.13)" : "transparent",
            color: comment ? C.dim : on ? C.text : "#9ca3af",
            minHeight: size * 1.6,
          }}
        >
          {l}
        </div>
      );
    })}
  </div>
);

export const Card = ({ children, style }) => (
  <div
    style={{
      background: C.panel,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: "26px 30px",
      boxShadow: "0 20px 50px rgba(0,0,0,.4)",
      ...style,
    }}
  >
    {children}
  </div>
);
