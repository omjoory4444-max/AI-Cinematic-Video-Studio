import React from "react";
import {useCurrentFrame} from "remotion";
import {GlassCard} from "../components/GlassCard";
import {Icon, IconName} from "../components/Icons";
import {SceneFrame} from "../components/SceneFrame";
import {FONT} from "../fonts";
import {colors} from "../theme";
import {getChunkTimings, getScene} from "../data/timeline";
import {float, reveal} from "../lib/anim";

const CARDS: Array<{icon: IconName; title: string; note: string}> = [
  {icon: "layers", title: "تفاوت المستويات", note: "كل طالبة تبدأ من نقطة مختلفة"},
  {icon: "clock", title: "ضيق الوقت", note: "حصص قليلة وأهداف كثيرة"},
  {icon: "eye", title: "صعوبة المتابعة", note: "تفاصيل دقيقة يصعب رصدها يدويًا"},
];

export const ChallengeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = getScene("challenge");
  const chunks = getChunkTimings("challenge");

  const heading = reveal(frame, 4, 24);
  const closing = reveal(frame, chunks[3]?.start ?? 150, 24);

  return (
    <SceneFrame frames={scene.frames}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 56}}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 84,
            color: colors.pink400,
            opacity: heading,
            transform: `translateY(${(1 - heading) * 26}px)`,
          }}
        >
          التحدّي
        </div>

        <div style={{display: "flex", gap: 48, direction: "rtl"}}>
          {CARDS.map((card, i) => {
            const p = reveal(frame, chunks[i]?.start ?? 20 + i * 40, 26);
            return (
              <div
                key={card.title}
                style={{
                  opacity: p,
                  transform: `translateY(${(1 - p) * 70 + float(frame, i, 7)}px) scale(${0.92 + p * 0.08})`,
                }}
              >
                <GlassCard width={480} height={330} style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 18}}>
                  <div
                    style={{
                      width: 108,
                      height: 108,
                      borderRadius: 30,
                      display: "grid",
                      placeItems: "center",
                      background: `${colors.pink400}22`,
                      color: colors.pink300,
                    }}
                  >
                    <Icon name={card.icon} size={64} />
                  </div>
                  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: colors.ivory}}>{card.title}</div>
                  <div style={{fontFamily: FONT, fontWeight: 400, fontSize: 32, color: colors.textDim, lineHeight: 1.4}}>
                    {card.note}
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 46,
            color: colors.ivory,
            opacity: closing,
            transform: `translateY(${(1 - closing) * 20}px)`,
          }}
        >
          الدعم التقليدي وحده <span style={{color: colors.pink400}}>غير كافٍ</span>
        </div>
      </div>
    </SceneFrame>
  );
};
