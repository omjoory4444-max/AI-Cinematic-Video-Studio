import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {RevealText} from "../components/RevealText";
import {SceneFrame} from "../components/SceneFrame";
import {FONT} from "../fonts";
import {brand, colors} from "../theme";
import {getScene} from "../data/timeline";
import {reveal} from "../lib/anim";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = getScene("outro");

  const line = reveal(frame, 40, 30);
  const sign = reveal(frame, 52, 28);
  const fadeToDark = interpolate(frame, [scene.frames - 24, scene.frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <SceneFrame frames={scene.frames} fade={10}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 36}}>
          <RevealText text="دعمٌ مكثف" delay={8} size={132} />
          <RevealText text="يصنع فرقًا حقيقيًا" delay={22} size={96} color={colors.pink400} weight={700} />

          <div
            style={{
              width: 520 * line,
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${colors.pink400}, transparent)`,
              marginTop: 10,
            }}
          />

          <div style={{display: "flex", flexDirection: "column", alignItems: "center", opacity: sign, transform: `translateY(${(1 - sign) * 20}px)`}}>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color: colors.ivory, lineHeight: 1.1}}>
              {brand.signatureAr}
            </div>
            <div dir="ltr" style={{fontFamily: FONT, fontWeight: 600, fontSize: 32, letterSpacing: 8, color: colors.pink300, textTransform: "uppercase"}}>
              {brand.signatureEn}
            </div>
          </div>
        </div>
      </SceneFrame>
      <AbsoluteFill style={{background: colors.navy950, opacity: fadeToDark * 0.85, pointerEvents: "none"}} />
    </>
  );
};
