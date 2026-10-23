import React from "react";
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {easeInOut, float, reveal} from "../lib/anim";
import {IMAGES, ImageKey, P} from "./config";

export const CARD_W = 800;
export const CARD_H = 800;
export const CARD_TOP = 96;

export type ShotDef = {
  image: ImageKey;
  /** start / end as a fraction of the scene (0..1) */
  f0: number;
  f1: number;
  /** vertical scroll (0 = top, 1 = bottom of the screenshot) */
  y0: number;
  y1: number;
  z0?: number;
  z1?: number;
  /** horizontal focus when zoomed (0 = left, 1 = right) */
  fx?: number;
};

const Shot: React.FC<{shot: ShotDef; frames: number}> = ({shot, frames}) => {
  const frame = useCurrentFrame();
  const img = IMAGES[shot.image];
  const start = shot.f0 * frames;
  const end = shot.f1 * frames;
  const t = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  const fade = 12;
  const opacity = interpolate(frame, [start - fade, start, end, end + fade], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (opacity <= 0) {
    return null;
  }

  const z0 = shot.z0 ?? 1;
  const z1 = shot.z1 ?? 1;
  const base = (CARD_W * img.h) / img.w;
  const vh = Math.min(CARD_H, base);
  const zoom = z0 + (z1 - z0) * t;
  const w = CARD_W * zoom;
  const h = base * zoom;
  const overY = Math.max(0, h - vh);
  const overX = Math.max(0, w - CARD_W);
  const ty = -(shot.y0 + (shot.y1 - shot.y0) * t) * overY;
  const tx = -(shot.fx ?? 0.5) * overX;

  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center", opacity}}>
      <div
        style={{
          width: CARD_W,
          height: vh,
          position: "relative",
          overflow: "hidden",
          borderRadius: 30,
          background: P.cream,
          boxShadow: "0 50px 140px rgba(2,4,14,0.65), 0 0 0 2px rgba(232,205,209,0.35)",
        }}
      >
        <Img
          src={staticFile(img.file)}
          style={{position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${tx}px, ${ty}px)`}}
        />
      </div>
    </AbsoluteFill>
  );
};

/** A floating screenshot "device" with a slow camera move and crossfading shots. */
export const CardStage: React.FC<{shots: ShotDef[]; frames: number; x?: number}> = ({shots, frames, x = 110}) => {
  const frame = useCurrentFrame();
  const p = reveal(frame, 0, 34);
  const bob = float(frame, 3, 7, 150);
  return (
    <div style={{position: "absolute", left: x, top: CARD_TOP, width: CARD_W, height: CARD_H}}>
      <div
        style={{
          position: "absolute",
          inset: -80,
          background: `radial-gradient(closest-side, ${P.pink}55, transparent 75%)`,
          opacity: 0.7 * p,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: p,
          transform: `perspective(2600px) translateY(${bob + (1 - p) * 60}px) rotateY(${3 + (1 - p) * 12}deg) scale(${0.92 + 0.08 * p})`,
        }}
      >
        {shots.map((shot, i) => (
          <Shot key={i} shot={shot} frames={frames} />
        ))}
      </div>
    </div>
  );
};
