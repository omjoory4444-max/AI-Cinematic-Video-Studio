import React from "react";
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {RevealText} from "../components/RevealText";
import {FONT} from "../fonts";
import {easeOut, reveal} from "../lib/anim";
import {IMAGES, P, SceneId, getScene} from "./config";
import {CARD_H, CARD_TOP, CardStage, ShotDef} from "./Stage";
import {Eyebrow, Panel, Ring, StatTile, Sub, Title, sec, useCount} from "./ui";

/** Right-hand column (RTL start side) that holds the information panel. */
const RightColumn: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      position: "absolute",
      right: 110,
      top: CARD_TOP,
      height: CARD_H,
      width: 800,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 22,
    }}
  >
    {children}
  </div>
);

/** Cross-fade helper for content that changes inside a scene (frames are scene-local). */
const Phase: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [from, from + 10, to - 10, to], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0) {
    return null;
  }
  return <div style={{opacity: o}}>{children}</div>;
};

const SceneFade: React.FC<{id: SceneId; children: React.ReactNode}> = ({id, children}) => {
  const frame = useCurrentFrame();
  const {frames} = getScene(id);
  const o = interpolate(frame, [0, 14, frames - 14, frames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

/* ------------------------------------------------------------------ 1. Title */

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {frames} = getScene("title");
  const drift = interpolate(frame, [0, frames], [1.05, 1.16]);
  const line = reveal(frame, sec(4.6), 30);
  const school = reveal(frame, sec(5.2), 24);
  return (
    <SceneFade id="title">
      <AbsoluteFill style={{opacity: 0.3, filter: "blur(22px)", transform: `scale(${drift})`}}>
        <Img src={staticFile(IMAGES.home.file)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 8%"}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: "radial-gradient(70% 70% at 50% 50%, rgba(6,11,33,0.2), rgba(6,11,33,0.85))"}} />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 18}}>
          <div style={{opacity: reveal(frame, 8, 24), fontFamily: FONT, fontWeight: 700, fontSize: 36, color: P.pinkSoft}}>
            منصة الدعم التعليمي المكثف
          </div>
          <RevealText text="من فجوة تعليمية…" delay={sec(1.2)} size={132} color={P.cream} />
          <RevealText text="إلى إنجاز ملموس" delay={sec(3.8)} size={132} color={P.pink} />
          <div
            style={{
              width: 560 * line,
              height: 3,
              marginTop: 14,
              background: `linear-gradient(90deg, transparent, ${P.pink}, transparent)`,
            }}
          />
          <div style={{opacity: school, fontFamily: FONT, fontWeight: 600, fontSize: 32, color: "#D8DAE8"}}>
            المتوسطة الحادية والعشرون بالدمام
          </div>
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};

/* -------------------------------------------------------------- 2. Interface */

export const InterfaceScene: React.FC = () => {
  const {frames} = getScene("interface");
  const shots: ShotDef[] = [{image: "home", f0: 0, f1: 1, y0: 0, y1: 1, z0: 1, z1: 1.05}];
  return (
    <SceneFade id="interface">
      <CardStage shots={shots} frames={frames} />
      <RightColumn>
        <Panel>
          <Eyebrow>الواجهة الرئيسية</Eyebrow>
          <Title size={56}>منصة الدعم التعليمي المكثف</Title>
          <Sub>من فجوة تعليمية إلى إنجاز ملموس</Sub>
          <div style={{display: "flex", justifyContent: "space-around", marginTop: 30}}>
            <Ring value={40} label="متوسط التحصيل القبلي" color={P.pink} start={sec(1.2)} />
            <Ring value={66.5} decimals={1} label="متوسط التحصيل البعدي" color={P.navy} start={sec(2.2)} />
          </div>
        </Panel>
      </RightColumn>
    </SceneFade>
  );
};

/* ---------------------------------------------------------------- 3. Stages */

const STAGES: Array<{n: number; name: string; q?: string}> = [
  {n: 1, name: "التشخيص", q: "كيف اكتشفنا الفجوة التعليمية؟"},
  {n: 2, name: "التخطيط", q: "كيف خططنا لمعالجتها؟"},
  {n: 3, name: "التدخل", q: "ما الذي نُفّذ فعليًا؟"},
  {n: 4, name: "المتابعة", q: "كيف تابعنا الطالبات؟"},
  {n: 5, name: "قياس الأثر"},
  {n: 6, name: "استدامة التحسن", q: "كيف نحافظ على الأثر؟"},
];

export const StagesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {frames} = getScene("stages");
  const shots: ShotDef[] = [{image: "compare", f0: 0, f1: 1, y0: 0.05, y1: 1, z0: 1.04, z1: 1}];
  return (
    <SceneFade id="stages">
      <CardStage shots={shots} frames={frames} />
      <RightColumn>
        <Panel>
          <Eyebrow>مراحل الخطة العلاجية</Eyebrow>
          <Title size={54}>ست مراحل… رحلة واحدة</Title>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 28, direction: "rtl"}}>
            {STAGES.map((s, i) => {
              const p = reveal(frame, sec(0.9 + i * 0.7), 22);
              return (
                <div
                  key={s.n}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 18px",
                    borderRadius: 22,
                    background: "#FFFDFB",
                    boxShadow: "inset 0 0 0 1.5px rgba(193,138,145,0.3)",
                    opacity: p,
                    transform: `translateY(${(1 - p) * 24}px) scale(${0.96 + 0.04 * p})`,
                  }}
                >
                  <div
                    style={{
                      flex: "none",
                      width: 58,
                      height: 58,
                      borderRadius: "50%",
                      background: P.pinkSoft,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: FONT,
                      fontWeight: 900,
                      fontSize: 30,
                      color: P.navy,
                    }}
                  >
                    {s.n}
                  </div>
                  <div>
                    <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 31, color: P.navy}}>{s.name}</div>
                    {s.q ? <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 20, color: P.dim, lineHeight: 1.35}}>{s.q}</div> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </RightColumn>
    </SceneFade>
  );
};

/* ---------------------------------------------------------- 4. Interventions */

const FLOW = ["الهدف", "الإجراء", "شواهد التنفيذ", "نتيجة التقويم", "التحسن المحقق"];

export const InterventionsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {frames} = getScene("interventions");
  const shots: ShotDef[] = [
    {image: "interventions", f0: 0, f1: 0.6, y0: 0.05, y1: 0.8, z0: 1, z1: 1.04},
    {image: "followUp", f0: 0.6, f1: 1, y0: 0, y1: 0.75, z0: 1.02, z1: 1},
  ];
  const split = Math.round(frames * 0.6);
  return (
    <SceneFade id="interventions">
      <CardStage shots={shots} frames={frames} />
      <RightColumn>
        <Panel>
          <Eyebrow>التدخلات والشواهد</Eyebrow>
          <Title size={54}>من الهدف إلى التحسن المحقق</Title>
          <div style={{minHeight: 40}}>
            <Phase from={0} to={split + 6}>
              <Sub size={28}>كل بطاقة: الهدف ← الإجراء ← شواهد التنفيذ ← نتيجة التقويم ← التحسن المحقق</Sub>
            </Phase>
            <div style={{marginTop: -40}}>
              <Phase from={split} to={frames}>
                <Sub size={28}>المتابعة — كيف تابعنا الطالبات؟ الأهداف، والإجراءات، وشواهد التنفيذ</Sub>
              </Phase>
            </div>
          </div>
          <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: 40}}>
            {FLOW.map((label, i) => {
              const p = reveal(frame, sec(0.8 + i * 0.6), 22);
              const last = i === FLOW.length - 1;
              return (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "12px 20px",
                    borderRadius: 20,
                    background: last ? P.navy : "#FFFDFB",
                    color: last ? P.cream : P.navy,
                    boxShadow: "inset 0 0 0 1.5px rgba(193,138,145,0.3)",
                    opacity: p,
                    transform: `translateX(${(1 - p) * 70}px)`,
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 32,
                  }}
                >
                  <span
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      background: last ? P.pink : P.pinkSoft,
                      color: P.navy,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      fontWeight: 900,
                    }}
                  >
                    {i + 1}
                  </span>
                  {label}
                </div>
              );
            })}
          </div>
        </Panel>
      </RightColumn>
    </SceneFade>
  );
};

/* -------------------------------------------------------------- 5. Comparison */

const CLASSES = [
  {name: "ثاني 1", n: 7, pre: 39, post: 64},
  {name: "ثاني 2", n: 6, pre: 45, post: 70},
  {name: "ثاني 3", n: 3, pre: 33, post: 68},
];

export const ComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {frames} = getScene("comparison");
  const shots: ShotDef[] = [
    {image: "compare", f0: 0, f1: 0.55, y0: 0, y1: 0, z0: 1, z1: 1.1, fx: 0.5},
    {image: "classBars", f0: 0.55, f1: 1, y0: 0, y1: 0, z0: 1, z1: 1.06},
  ];
  const split = Math.round(frames * 0.55);
  const gain = useCount(sec(0.6), 50, 0, 26.5);
  const n19 = Math.round(useCount(sec(1.6), 36, 0, 19));
  const n46 = Math.round(useCount(sec(1.9), 36, 0, 46));
  return (
    <SceneFade id="comparison">
      <CardStage shots={shots} frames={frames} />
      <RightColumn>
        <Panel>
          <Eyebrow>المقارنة القبلية والبعدية</Eyebrow>
          <div style={{display: "flex", alignItems: "baseline", gap: 20}}>
            <div dir="ltr" style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, lineHeight: 1, color: P.green}}>
              +{gain.toFixed(1)}
            </div>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 34, color: P.navy}}>نقطة مئوية</div>
          </div>
          <Sub size={30}>من متوسط 40% قبل الخطة إلى 66.5% بعدها</Sub>

          <div style={{position: "relative", height: 330, marginTop: 24}}>
            <div style={{position: "absolute", inset: 0}}>
              <Phase from={0} to={split + 8}>
                <div style={{display: "flex", gap: 20, marginTop: 10}}>
                  <StatTile value={String(n19)} label="طالبة مستهدفة" delay={sec(1.4)} color={P.blue} />
                  <StatTile value={String(n46)} label="شاهدًا" delay={sec(1.7)} color={P.pink} />
                </div>
                <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 24, lineHeight: 1.5, color: P.dim, marginTop: 24}}>
                  أرقام التحسن محسوبة من درجات الاختبارين القبلي والبعدي فقط.
                </div>
              </Phase>
            </div>
            <div style={{position: "absolute", inset: 0}}>
              <Phase from={split} to={frames}>
                <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                  {CLASSES.map((c, i) => {
                    const p = reveal(frame, split + sec(0.3 + i * 0.4), 20);
                    return (
                      <div
                        key={c.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 22px",
                          borderRadius: 18,
                          background: "#FFFDFB",
                          boxShadow: "inset 0 0 0 1.5px rgba(193,138,145,0.3)",
                          opacity: p,
                          transform: `translateY(${(1 - p) * 18}px)`,
                          fontFamily: FONT,
                        }}
                      >
                        <div style={{fontWeight: 900, fontSize: 30, color: P.navy}}>
                          {c.name} <span style={{fontWeight: 600, fontSize: 22, color: P.dim}}>({c.n} طالبات)</span>
                        </div>
                        <div dir="ltr" style={{fontWeight: 900, fontSize: 32, color: P.navy}}>
                          <span style={{color: P.pink}}>{c.pre}%</span> → <span style={{color: P.blue}}>{c.post}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Phase>
            </div>
          </div>
        </Panel>
      </RightColumn>
    </SceneFade>
  );
};

/* ---------------------------------------------------------------- 6. Impact */

export const ImpactScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {frames} = getScene("impact");
  const shots: ShotDef[] = [
    {image: "impact1", f0: 0, f1: 0.5, y0: 0, y1: 1, z0: 1, z1: 1.03},
    {image: "allImproved", f0: 0.5, f1: 1, y0: 0, y1: 0, z0: 1, z1: 1.08},
  ];
  const split = Math.round(frames * 0.5);
  const big = reveal(frame, split + 4, 24);
  return (
    <SceneFade id="impact">
      <CardStage shots={shots} frames={frames} />
      <RightColumn>
        <Panel>
          <Eyebrow>قياس الأثر</Eyebrow>
          <Title size={54}>استعراض أثر الخطة</Title>
          <div style={{position: "relative", height: 250, marginTop: 24}}>
            <div style={{position: "absolute", inset: 0}}>
              <Phase from={0} to={split + 6}>
                <div style={{display: "flex", gap: 20}}>
                  <StatTile value="16" label="طالبة مستهدفة (قبلي وبعدي)" delay={sec(0.4)} color={P.blue} size={90} />
                  <StatTile value="40.2%" label="متوسط التحصيل القبلي" delay={sec(0.8)} color={P.pink} size={90} />
                </div>
              </Phase>
            </div>
            <div style={{position: "absolute", inset: 0}}>
              <Phase from={split} to={frames}>
                <div style={{opacity: big, transform: `scale(${0.94 + 0.06 * big})`, textAlign: "center"}}>
                  <div dir="ltr" style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, lineHeight: 1.05, color: P.navy}}>
                    16 / 16
                  </div>
                  <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 38, color: P.green}}>تحسّنت درجاتهن — 100%</div>
                </div>
              </Phase>
            </div>
          </div>
        </Panel>
      </RightColumn>
    </SceneFade>
  );
};

/* ------------------------------------------------------------- 7. Journeys */

export const JourneysScene: React.FC = () => {
  const {frames} = getScene("journeys");
  const shots: ShotDef[] = [
    {image: "progress", f0: 0, f1: 0.5, y0: 0, y1: 1, z0: 1, z1: 1.06},
    {image: "roster1", f0: 0.5, f1: 1, y0: 0.08, y1: 0.3, z0: 1, z1: 1.04},
  ];
  return (
    <SceneFade id="journeys">
      <CardStage shots={shots} frames={frames} />
      <RightColumn>
        <Panel>
          <Eyebrow>رحلات التقدم</Eyebrow>
          <Title size={58}>الطالبات ورحلات التقدم</Title>
          <Sub size={32}>درجة كل طالبة قبل الخطة وبعدها</Sub>
        </Panel>
      </RightColumn>
    </SceneFade>
  );
};

/* ------------------------------------------------------------- 8. Closing */

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {frames} = getScene("closing");
  const name = reveal(frame, 10, 36);
  const en = reveal(frame, 28, 30);
  const line = reveal(frame, 40, 30);
  const tag = reveal(frame, sec(1.6), 28);
  const credits = reveal(frame, sec(3), 28);
  const toDark = interpolate(frame, [frames - 36, frames], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut});
  return (
    <>
      <SceneFade id="closing">
        <AbsoluteFill style={{opacity: 0.22, filter: "blur(26px)", transform: `scale(${1.1 + frame / 2400})`}}>
          <Img src={staticFile(IMAGES.home.file)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 6%"}} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: "radial-gradient(70% 70% at 50% 50%, rgba(6,11,33,0.25), rgba(6,11,33,0.9))"}} />
        <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 220,
                lineHeight: 1.05,
                color: P.cream,
                opacity: name,
                transform: `translateY(${(1 - name) * 30}px)`,
              }}
            >
              نهى
            </div>
            <div
              dir="ltr"
              style={{
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 46,
                letterSpacing: 14,
                color: P.pink,
                textTransform: "uppercase",
                opacity: en,
              }}
            >
              English Teacher
            </div>
            <div style={{width: 520 * line, height: 3, margin: "22px 0", background: `linear-gradient(90deg, transparent, ${P.pink}, transparent)`}} />
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 54, color: P.pinkSoft, opacity: tag, transform: `translateY(${(1 - tag) * 18}px)`}}>
              نرصد التقدم، لنصنع الأثر
            </div>
            <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 28, color: "#C9CCE0", marginTop: 26, textAlign: "center", lineHeight: 1.7, opacity: credits}}>
              منصة الدعم التعليمي المكثف · المتوسطة الحادية والعشرون بالدمام
              <br />
              المعلمة: نهى الجمّاز · قائدة المدرسة: أمل البوعينين
            </div>
          </div>
        </AbsoluteFill>
      </SceneFade>
      <AbsoluteFill style={{background: "#02040E", opacity: toDark * 0.9, pointerEvents: "none"}} />
    </>
  );
};
