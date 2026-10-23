import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {RevealText} from "../components/RevealText";
import {SceneFrame} from "../components/SceneFrame";
import {FONT} from "../fonts";
import {colors} from "../theme";
import {getChunkTimings, getScene} from "../data/timeline";
import {reveal} from "../lib/anim";

const WAVES = [
  {amp: 46, freq: 0.0062, speed: 0.045, color: colors.pink400, width: 4, opacity: 0.95},
  {amp: 70, freq: 0.0041, speed: 0.03, color: colors.pink300, width: 3, opacity: 0.6},
  {amp: 30, freq: 0.0093, speed: 0.06, color: colors.ivory, width: 2, opacity: 0.4},
];

/** Rhythm waves: "every student has her own learning rhythm". */
const Waves: React.FC<{frame: number; width: number}> = ({frame, width}) => {
  const appear = reveal(frame, 6, 40);
  return (
    <svg width={width} height={220} viewBox={`0 0 ${width} 220`} style={{opacity: appear}}>
      {WAVES.map((w, idx) => {
        let d = "";
        for (let x = 0; x <= width; x += 10) {
          const y = 110 + Math.sin(x * w.freq + frame * w.speed + idx * 1.7) * w.amp * (0.55 + 0.45 * appear);
          d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)} `;
        }
        return <path key={idx} d={d} fill="none" stroke={w.color} strokeWidth={w.width} strokeLinecap="round" opacity={w.opacity} />;
      })}
    </svg>
  );
};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const scene = getScene("hook");
  const chunks = getChunkTimings("hook");

  const subStart = chunks[1]?.start ?? 60;
  const sub = reveal(frame, subStart, 26);

  return (
    <SceneFrame frames={scene.frames}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
        <div style={{marginBottom: -20}}>
          <Waves frame={frame} width={width - 280} />
        </div>
        <RevealText text="لكل طالبة إيقاعها" delay={10} size={128} />
        <RevealText text="في التعلّم" delay={30} size={128} color={colors.pink400} />
        <div
          style={{
            marginTop: 26,
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 48,
            color: colors.textDim,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 24}px)`,
          }}
        >
          ومن حقها أن تجد دعمًا يوصلها إلى النجاح
        </div>
      </div>
    </SceneFrame>
  );
};
