import React from "react";
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";
import {BAR, colors} from "../theme";

const PARTICLES = 46;

const noise =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

/** Persistent cinematic backdrop: navy gradient, dusty-pink light leaks, drifting dust, grain and letterbox. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();

  const glowX = interpolate(frame, [0, durationInFrames], [18, 82]);
  const glowY = 50 + Math.sin(frame / 90) * 12;
  const glow2X = interpolate(frame, [0, durationInFrames], [86, 24]);
  const glow2Y = 62 + Math.cos(frame / 110) * 10;

  const barIn = interpolate(frame, [0, 24], [0, BAR], {extrapolateRight: "clamp"});

  return (
    <AbsoluteFill style={{background: colors.navy950, overflow: "hidden"}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 20%, ${colors.navy700} 0%, ${colors.navy900} 55%, ${colors.navy950} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(38% 46% at ${glowX}% ${glowY}%, ${colors.pink500}33 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(34% 42% at ${glow2X}% ${glow2Y}%, ${colors.navy600}88 0%, transparent 72%)`,
        }}
      />

      {Array.from({length: PARTICLES}).map((_, i) => {
        const x = random(`px-${i}`) * width;
        const size = 2 + random(`ps-${i}`) * 5;
        const speed = 0.25 + random(`pv-${i}`) * 0.7;
        const baseY = random(`py-${i}`) * height;
        const y = (((baseY - frame * speed) % height) + height) % height;
        const twinkle = 0.25 + 0.55 * Math.abs(Math.sin((frame + i * 13) / 38));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 3 === 0 ? colors.pink300 : colors.ivory,
              opacity: twinkle * 0.45,
              filter: "blur(0.6px)",
            }}
          />
        );
      })}

      <AbsoluteFill style={{backgroundImage: noise, opacity: 0.07, mixBlendMode: "overlay"}} />
      <AbsoluteFill
        style={{background: "radial-gradient(90% 90% at 50% 50%, transparent 55%, rgba(3,6,18,0.7) 100%)"}}
      />

      <div style={{position: "absolute", top: 0, left: 0, right: 0, height: barIn, background: "#02040E"}} />
      <div style={{position: "absolute", bottom: 0, left: 0, right: 0, height: barIn, background: "#02040E"}} />
    </AbsoluteFill>
  );
};
