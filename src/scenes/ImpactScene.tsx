import React from "react";
import {useCurrentFrame} from "remotion";
import {Icon} from "../components/Icons";
import {SceneFrame} from "../components/SceneFrame";
import {FONT} from "../fonts";
import {colors} from "../theme";
import {getChunkTimings, getScene} from "../data/timeline";
import {float, reveal} from "../lib/anim";

const ITEMS = ["خطة واضحة", "متابعة مستمرة", "تحسّن قابل للقياس"];

export const ImpactScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = getScene("impact");
  const chunks = getChunkTimings("impact");

  const heading = reveal(frame, 4, 24);

  return (
    <SceneFrame frames={scene.frames}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 56}}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 96,
            color: colors.pink400,
            opacity: heading,
            transform: `translateY(${(1 - heading) * 26}px)`,
          }}
        >
          النتيجة
        </div>

        <div style={{display: "flex", flexDirection: "column", gap: 28, alignItems: "stretch", direction: "rtl"}}>
          {ITEMS.map((label, i) => {
            const p = reveal(frame, chunks[i + 1]?.start ?? 30 + i * 45, 26);
            return (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  padding: "18px 56px 18px 64px",
                  borderRadius: 28,
                  background: `linear-gradient(90deg, ${colors.navy700}E6, ${colors.navy800}E6)`,
                  border: `1.5px solid ${colors.pink400}55`,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 120 + float(frame, i, 5)}px)`,
                  boxShadow: `0 20px 60px rgba(2,4,14,0.5)`,
                }}
              >
                <span style={{color: colors.pink300, transform: `scale(${0.6 + p * 0.4})`, display: "inline-flex"}}>
                  <Icon name="check" size={76} strokeWidth={2.4} />
                </span>
                <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 76, color: colors.ivory}}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};
