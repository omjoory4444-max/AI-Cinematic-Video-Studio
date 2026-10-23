import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {GlassCard} from "../components/GlassCard";
import {Icon} from "../components/Icons";
import {SceneFrame} from "../components/SceneFrame";
import {FONT} from "../fonts";
import {colors} from "../theme";
import {getChunkTimings, getScene} from "../data/timeline";
import {easeOut, reveal} from "../lib/anim";

// Purely illustrative sample values: no real student data is ever used in this repo.
const WEEKS = [32, 41, 48, 57, 66, 78];
const CHART_H = 300;
const RING_R = 118;
const RING_LEN = 2 * Math.PI * RING_R;

export const ProgressScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = getScene("progress");
  const chunks = getChunkTimings("progress");

  const heading = reveal(frame, 4, 24);
  const panel = reveal(frame, 14, 30);
  const growStart = chunks[1]?.start ?? 70;
  const adjustStart = chunks[2]?.start ?? 170;
  const ringValue = WEEKS[WEEKS.length - 1];
  const ringProgress = reveal(frame, growStart + 10, 80);

  return (
    <SceneFrame frames={scene.frames}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 40}}>
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
          لوحة <span style={{color: colors.pink400}}>المتابعة</span>
        </div>

        <div style={{opacity: panel, transform: `translateY(${(1 - panel) * 50}px)`}}>
          <GlassCard width={1560} height={560} style={{position: "relative", display: "flex", gap: 70, alignItems: "center", padding: "36px 56px"}}>
            <div
              style={{
                position: "absolute",
                insetBlockStart: 22,
                insetInlineEnd: 34,
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 24,
                color: colors.pink300,
                padding: "4px 16px",
                borderRadius: 999,
                border: `1px solid ${colors.pink400}55`,
              }}
            >
              بيانات توضيحية
            </div>

            {/* bar chart (week 1 on the right, as Arabic reads) */}
            <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 14}}>
              <div style={{position: "relative", height: CHART_H + 70, display: "flex", alignItems: "flex-end", gap: 34, direction: "rtl"}}>
                <div
                  style={{
                    position: "absolute",
                    insetInline: 0,
                    bottom: CHART_H * 0.7,
                    borderTop: `2px dashed ${colors.pink400}66`,
                  }}
                />
                {WEEKS.map((value, i) => {
                  const g = reveal(frame, growStart + i * 9, 34);
                  const h = (value / 100) * CHART_H * g;
                  const isAdjust = i === 3;
                  const pin = reveal(frame, adjustStart, 24);
                  return (
                    <div key={i} style={{position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%"}}>
                      {isAdjust ? (
                        <div
                          style={{
                            position: "absolute",
                            bottom: h + 18,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            whiteSpace: "nowrap",
                            padding: "8px 18px",
                            borderRadius: 999,
                            background: colors.pink400,
                            color: colors.navy900,
                            fontFamily: FONT,
                            fontWeight: 700,
                            fontSize: 28,
                            opacity: pin,
                            transform: `translateY(${(1 - pin) * -22}px) scale(${0.8 + pin * 0.2})`,
                          }}
                        >
                          <Icon name="plan" size={28} color={colors.navy900} strokeWidth={2.4} />
                          تعديل الخطة
                        </div>
                      ) : null}
                      <div
                        style={{
                          width: "100%",
                          height: h,
                          borderRadius: "18px 18px 6px 6px",
                          background: `linear-gradient(180deg, ${colors.pink300}, ${colors.pink600})`,
                          boxShadow: isAdjust && pin > 0.1 ? `0 0 34px ${colors.pink400}88` : "none",
                        }}
                      />
                      <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 28, color: colors.textDim, marginTop: 12}}>
                        الأسبوع {i + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ring gauge */}
            <div style={{width: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 14}}>
              <div style={{position: "relative", width: 280, height: 280}}>
                <svg width={280} height={280} viewBox="0 0 280 280" style={{transform: "rotate(-90deg)"}}>
                  <circle cx={140} cy={140} r={RING_R} fill="none" stroke={`${colors.navy600}`} strokeWidth={22} />
                  <circle
                    cx={140}
                    cy={140}
                    r={RING_R}
                    fill="none"
                    stroke={colors.pink400}
                    strokeWidth={22}
                    strokeLinecap="round"
                    strokeDasharray={RING_LEN}
                    strokeDashoffset={RING_LEN * (1 - (ringValue / 100) * ringProgress)}
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: 84,
                    color: colors.ivory,
                    direction: "ltr",
                  }}
                >
                  {Math.round(interpolate(ringProgress, [0, 1], [0, ringValue], {easing: easeOut}))}%
                </div>
              </div>
              <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 34, color: colors.pink300}}>مؤشر النمو</div>
            </div>
          </GlassCard>
        </div>
      </div>
    </SceneFrame>
  );
};
