import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {FONT} from "../fonts";
import {easeOut, reveal} from "../lib/anim";
import {FPS, P} from "./config";

export const sec = (s: number): number => Math.round(s * FPS);

/** Cream platform-style card used for the information panels beside the screenshots. */
export const Panel: React.FC<{children: React.ReactNode; delay?: number; width?: number; style?: React.CSSProperties}> = ({
  children,
  delay = 6,
  width = 800,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = reveal(frame, delay, 28);
  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        width,
        boxSizing: "border-box",
        padding: "44px 52px",
        borderRadius: 36,
        background: `linear-gradient(160deg, ${P.cream}, ${P.creamDeep})`,
        color: P.navy,
        fontFamily: FONT,
        direction: "rtl",
        boxShadow: "0 40px 120px rgba(2,4,14,0.55), inset 0 0 0 1.5px rgba(193,138,145,0.35)",
        opacity: p,
        transform: `translateX(${(1 - p) * 90}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Eyebrow: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 30, color: P.pink, letterSpacing: 0, marginBottom: 8}}>
    {children}
  </div>
);

export const Title: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 64}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.25, color: P.navy}}>{children}</div>
);

export const Sub: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 32}) => (
  <div style={{fontFamily: FONT, fontWeight: 600, fontSize: size, lineHeight: 1.5, color: P.dim, marginTop: 8}}>
    {children}
  </div>
);

/** Number that counts up from `from` to `to` between frames `start` and `start + dur`. */
export const useCount = (start: number, dur: number, from: number, to: number): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
};

export const Ring: React.FC<{
  value: number;
  label: string;
  caption?: string;
  color: string;
  start: number;
  size?: number;
  decimals?: number;
}> = ({value, label, caption, color, start, size = 230, decimals = 0}) => {
  const frame = useCurrentFrame();
  const shown = useCount(start, 42, 0, value);
  const appear = reveal(frame, start - 8, 20);
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: appear}}>
      <div style={{position: "relative", width: size, height: size}}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform: "rotate(-90deg)"}}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={P.pinkSoft} strokeWidth={stroke} opacity={0.55} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - shown / 100)}
          />
        </svg>
        <div
          dir="ltr"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: size * 0.26,
            color: P.navy,
          }}
        >
          {shown.toFixed(decimals)}%
        </div>
      </div>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 28, color: P.navy}}>{label}</div>
      {caption ? <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 22, color: P.dim}}>{caption}</div> : null}
    </div>
  );
};

/** Small stat tile (number + label). */
export const StatTile: React.FC<{
  value: string;
  label: string;
  delay: number;
  color?: string;
  size?: number;
}> = ({value, label, delay, color = P.navy, size = 76}) => {
  const frame = useCurrentFrame();
  const p = reveal(frame, delay, 24);
  return (
    <div
      style={{
        flex: 1,
        padding: "20px 24px",
        borderRadius: 24,
        background: "#FFFDFB",
        boxShadow: "inset 0 0 0 1.5px rgba(193,138,145,0.3)",
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`,
        textAlign: "center",
      }}
    >
      <div dir="ltr" style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.1, color}}>
        {value}
      </div>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 26, color: P.dim, marginTop: 4}}>{label}</div>
    </div>
  );
};
