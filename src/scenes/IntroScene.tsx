import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {Icon, IconName} from "../components/Icons";
import {SceneFrame} from "../components/SceneFrame";
import {FONT} from "../fonts";
import {brand, colors} from "../theme";
import {getChunkTimings, getScene} from "../data/timeline";
import {easeOut, reveal} from "../lib/anim";

const PILLS: Array<{icon: IconName; label: string}> = [
  {icon: "plan", label: "الخطة"},
  {icon: "bolt", label: "التدريب"},
  {icon: "chart", label: "المتابعة"},
];

/** Platform reveal: expanding rings, shimmering title, three pillars. */
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = getScene("intro");
  const chunks = getChunkTimings("intro");

  const titleStart = chunks[1]?.start ?? 20;
  const pillsStart = chunks[2]?.start ?? 110;

  const title = reveal(frame, titleStart, 34);
  const sub = reveal(frame, titleStart + 14, 28);
  const shine = interpolate(frame, [titleStart + 20, titleStart + 120], [-40, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <SceneFrame frames={scene.frames}>
      <div style={{position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 28}}>
        <div style={{position: "absolute", top: -140, width: 0, height: 0}}>
          {[0, 1, 2].map((i) => {
            const p = reveal(frame, 4 + i * 14, 70);
            const size = 280 + i * 190;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: -size / 2,
                  top: -size / 2 + 220,
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  border: `2px solid ${colors.pink400}`,
                  opacity: (1 - p) * 0.55,
                  transform: `scale(${0.4 + p * 0.9})`,
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: 38,
            display: "grid",
            placeItems: "center",
            color: colors.navy900,
            background: `linear-gradient(145deg, ${colors.pink300}, ${colors.pink500})`,
            boxShadow: `0 20px 70px ${colors.pink500}66`,
            opacity: reveal(frame, 0, 26),
            transform: `scale(${0.7 + reveal(frame, 0, 30) * 0.3}) rotate(${(1 - reveal(frame, 0, 30)) * -18}deg)`,
          }}
        >
          <Icon name="spark" size={78} color={colors.navy900} strokeWidth={2.4} />
        </div>

        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 118,
            lineHeight: 1.3,
            opacity: title,
            transform: `translateY(${(1 - title) * 40}px)`,
            backgroundImage: `linear-gradient(100deg, ${colors.ivory} ${shine - 30}%, ${colors.pink300} ${shine}%, ${colors.ivory} ${shine + 30}%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {brand.platformAr}
        </div>

        <div
          dir="ltr"
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: colors.pink400,
            opacity: sub,
          }}
        >
          {brand.platformEn}
        </div>

        <div style={{display: "flex", gap: 36, marginTop: 40, direction: "rtl"}}>
          {PILLS.map((pill, i) => {
            const p = reveal(frame, pillsStart + i * 12, 22);
            return (
              <div
                key={pill.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "18px 40px",
                  borderRadius: 999,
                  background: `${colors.navy700}E6`,
                  border: `1.5px solid ${colors.pink400}66`,
                  color: colors.pink300,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 30}px)`,
                }}
              >
                <Icon name={pill.icon} size={44} />
                <span style={{fontFamily: FONT, fontWeight: 700, fontSize: 44, color: colors.ivory}}>{pill.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};
