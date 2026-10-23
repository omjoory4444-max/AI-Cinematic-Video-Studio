import React from "react";
import {useCurrentFrame} from "remotion";
import {GlassCard} from "../components/GlassCard";
import {Icon, IconName} from "../components/Icons";
import {SceneFrame} from "../components/SceneFrame";
import {FONT} from "../fonts";
import {colors} from "../theme";
import {getChunkTimings, getScene} from "../data/timeline";
import {float, reveal} from "../lib/anim";

const STEPS: Array<{icon: IconName; title: string; note: string}> = [
  {icon: "search", title: "تشخيص", note: "قياس دقيق لمستوى الطالبة"},
  {icon: "plan", title: "خطة علاجية", note: "أهداف واضحة ومخصصة"},
  {icon: "bolt", title: "تدريب مكثف", note: "تمارين مركّزة على المهارات"},
  {icon: "chart", title: "قياس التقدّم", note: "نتائج تُراجع باستمرار"},
];

const CARD_W = 372;
const GAP = 44;

export const HowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = getScene("how");
  const chunks = getChunkTimings("how");

  const heading = reveal(frame, 4, 24);
  const lineWidth = (CARD_W + GAP) * (STEPS.length - 1);

  // The connecting line grows as each step is spoken.
  const lineProgress = STEPS.reduce((acc, _s, i) => {
    const start = chunks[i]?.start ?? 20 + i * 70;
    return i === 0 ? 0 : Math.max(acc, reveal(frame, start - 14, 30) * (i / (STEPS.length - 1)));
  }, 0);

  return (
    <SceneFrame frames={scene.frames}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 50}}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 80,
            color: colors.ivory,
            opacity: heading,
            transform: `translateY(${(1 - heading) * 24}px)`,
          }}
        >
          كيف تعمل <span style={{color: colors.pink400}}>المنصة؟</span>
        </div>

        <div style={{position: "relative", direction: "rtl"}}>
          {/* progress rail (right → left in RTL) */}
          <div
            style={{
              position: "absolute",
              top: 59,
              insetInlineStart: CARD_W / 2,
              width: lineWidth,
              height: 6,
              borderRadius: 3,
              background: `${colors.navy600}`,
            }}
          >
            <div
              style={{
                position: "absolute",
                insetBlock: 0,
                insetInlineStart: 0,
                width: `${lineProgress * 100}%`,
                borderRadius: 3,
                background: `linear-gradient(270deg, ${colors.pink300}, ${colors.pink500})`,
                boxShadow: `0 0 24px ${colors.pink400}88`,
              }}
            />
          </div>

          <div style={{display: "flex", gap: GAP, direction: "rtl"}}>
            {STEPS.map((step, i) => {
              const p = reveal(frame, chunks[i]?.start ?? 20 + i * 70, 26);
              return (
                <div
                  key={step.title}
                  style={{
                    width: CARD_W,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 60 + float(frame, i, 6)}px)`,
                  }}
                >
                  <div style={{display: "grid", placeItems: "center", height: 124}}>
                    <div
                      style={{
                        width: 124,
                        height: 124,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        color: colors.navy900,
                        background: `linear-gradient(145deg, ${colors.pink300}, ${colors.pink500})`,
                        boxShadow: `0 0 ${20 + p * 40}px ${colors.pink500}77`,
                        transform: `scale(${0.6 + p * 0.4})`,
                      }}
                    >
                      <Icon name={step.icon} size={62} color={colors.navy900} strokeWidth={2.4} />
                    </div>
                  </div>
                  <GlassCard width={CARD_W} height={250} style={{marginTop: 26, padding: 28}}>
                    <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 30, color: colors.pink400}}>
                      الخطوة {i + 1}
                    </div>
                    <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 50, color: colors.ivory, marginTop: 4}}>
                      {step.title}
                    </div>
                    <div style={{fontFamily: FONT, fontWeight: 400, fontSize: 30, color: colors.textDim, marginTop: 8, lineHeight: 1.4}}>
                      {step.note}
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
